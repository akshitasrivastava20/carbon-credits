// app/api/credits/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateCarbonCredits } from "@/lib/calculateCredits";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Get the Clerk user ID from the request headers or query params
    const url = new URL(req.url);
    const clerkUserId = url.searchParams.get('userId');
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: "User authentication required" },
        { status: 401 }
      );
    }

    // Find the company for this user
    const company = await prisma.company.findUnique({
      where: { clerkUserId },
      include: { usages: true }
    });

    if (!company) {
      return NextResponse.json(
        { error: "No company found for this user" },
        { status: 404 }
      );
    }

    // Calculate carbon credits for this company
    const result = await calculateCarbonCredits(company.id);
    
    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        industry: company.industry
      },
      carbonData: result
    });

  } catch (error) {
    console.error("Error calculating credits:", error);
    return NextResponse.json(
      { error: "Failed to calculate carbon credits" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
