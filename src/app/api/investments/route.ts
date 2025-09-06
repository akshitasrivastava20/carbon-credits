import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { createInvestmentPayment, calculateInvestmentTotal, type CarbonCreditInvestment } from "@/lib/dodo";

const prisma = new PrismaClient();

// Helper function to retry database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
        console.log(`Database connection attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await auth();
    const userId = authResult?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, creditAmount, investorEmail, investorName } = body;

    // Validate input
    if (!projectId || !creditAmount || !investorEmail || !investorName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (creditAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Credit amount must be positive" },
        { status: 400 }
      );
    }

    // Get project details
    const project = await withRetry(() => 
      prisma.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          title: true,
          pricePerCredit: true,
          availableCredits: true,
          totalCredits: true
        }
      })
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if enough credits are available
    if (creditAmount > project.availableCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Only ${project.availableCredits} credits available. Requested: ${creditAmount}` 
        },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = calculateInvestmentTotal(creditAmount, project.pricePerCredit);

    // Create investment object
    const investment: CarbonCreditInvestment = {
      projectId,
      creditAmount,
      pricePerCredit: project.pricePerCredit,
      totalAmount,
      investorEmail,
      investorName
    };

    // Create success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const successUrl = `${baseUrl}/investment/success?project=${projectId}&credits=${creditAmount}`;
    const cancelUrl = `${baseUrl}/investment/cancel?project=${projectId}`;

    // Create payment with Dodo Payments
    const paymentResult = await createInvestmentPayment(investment, successUrl, cancelUrl);

    // Store investment intent in database (pending status)
    const investmentRecord = await withRetry(() => 
      prisma.investment.create({
        data: {
          projectId: projectId,
          companyId: userId, // Using Clerk user ID as company ID
          creditsBought: creditAmount,
          totalPrice: totalAmount,
          // Note: paymentStatus field needs to be added to schema
          // paymentStatus: "pending",
          // paymentSessionId: paymentResult.sessionId,
          // investorEmail: investorEmail,
          // investorName: investorName
        }
      })
    );

    return NextResponse.json({
      success: true,
      investment: {
        id: investmentRecord.id,
        projectTitle: project.title,
        creditAmount,
        pricePerCredit: project.pricePerCredit,
        totalAmount,
        paymentUrl: paymentResult.url,
        sessionId: paymentResult.sessionId
      }
    });

  } catch (error: any) {
    console.error("Investment creation error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return NextResponse.json({ 
        success: false, 
        error: "Database temporarily unavailable. Please try again."
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create investment. Please try again."
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to retrieve user's investments
export async function GET(request: NextRequest) {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const investments = await withRetry(() => 
      prisma.investment.findMany({
        where: { companyId: userId },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              description: true,
              location: true,
              projectImages: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    );

    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalPrice, 0);
    const totalCredits = investments.reduce((sum, inv) => sum + inv.creditsBought, 0);

    return NextResponse.json({
      success: true,
      investments,
      summary: {
        totalInvestments: investments.length,
        totalInvested,
        totalCredits,
        // Note: Payment status tracking will be added when schema is updated
        successfulInvestments: investments.length, // Temporary - assume all are successful
        pendingInvestments: 0 // Temporary
      }
    });

  } catch (error: any) {
    console.error("Investments fetch error:", error);
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch investments."
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}
