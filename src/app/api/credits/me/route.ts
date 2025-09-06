import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { calculateCarbonCredits } from "@/lib/calculateCredits";

const prisma = new PrismaClient();

// Helper function to retry database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      // Check if it's a connection error
      if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
        console.log(`Database connection attempt ${attempt} failed, retrying...`);
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      // If it's not a connection error, don't retry
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function GET() {
  try {
    // Get the authenticated user's ID from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated. Please sign in to view your carbon credits." },
        { status: 401 }
      );
    }

    // Find the company for this user (with retry)
    const company = await withRetry(() => 
      prisma.company.findUnique({
        where: { clerkUserId: userId },
        include: { usages: true }
      })
    );

    if (!company) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No company found for this user. Please register your company first.",
          needsRegistration: true
        },
        { status: 404 }
      );
    }

    // Calculate carbon credits using the company ID
    const credits = await calculateCarbonCredits(company.id);

    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        email: company.email,
        status: company.status,
        createdAt: company.createdAt
      },
      credits: {
        totalKgCO2: credits.totalKgCO2,
        totalTons: credits.totalTons,
        creditsNeeded: credits.creditsNeeded
      },
      usages: company.usages.map(usage => ({
        id: usage.id,
        type: usage.type,
        amount: usage.amount,
        createdAt: usage.createdAt
      })),
      summary: {
        totalUsageRecords: company.usages.length,
        estimatedCost: credits.creditsNeeded * 25, // Assuming $25 per credit
        environmentalImpact: `${credits.totalTons.toFixed(2)} tons CO₂e`
      }
    });

  } catch (error: any) {
    console.error("Credits calculation error:", error);
    
    // Handle specific database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return NextResponse.json({ 
        success: false, 
        error: "Database is temporarily unavailable. Please try again in a moment." 
      }, { status: 503 });
    }
    
    // Handle other Prisma errors
    if (error.code?.startsWith('P')) {
      return NextResponse.json({ 
        success: false, 
        error: "Database error occurred. Please try again." 
      }, { status: 500 });
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to calculate credits. Please try again." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
