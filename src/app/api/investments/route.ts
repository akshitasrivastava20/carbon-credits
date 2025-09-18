import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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

    // Check if this is a test mode payment
    const isTestMode = paymentResult.sessionId.startsWith('test_session_');

    // Check if company record exists, create if it doesn't
    let company = await withRetry(() => 
      prisma.company.findUnique({
        where: { clerkUserId: userId }
      })
    );

    if (!company) {
      // Create a basic company record for the user
      company = await withRetry(() => 
        prisma.company.create({
          data: {
            clerkUserId: userId,
            name: investorName || "Individual Investor",
            email: investorEmail,
            status: "active"
          }
        })
      );
    }

    // Store investment intent in database (pending status)
    const investmentRecord = await withRetry(() => 
      prisma.investment.create({
        data: {
          projectId: projectId,
          companyId: company.id, // Use the company ID instead of user ID
          creditsBought: creditAmount,
          totalPrice: totalAmount,
        }
      })
    );

    // For test mode, also create a transaction record immediately
    if (isTestMode) {
      const platformFee = totalAmount * 0.05; // 5% platform fee
      const payoutAmount = totalAmount - platformFee;

      await withRetry(() => 
        prisma.transaction.create({
          data: {
            investmentId: investmentRecord.id,
            // Skip productId for test mode since it's optional now
            companyId: company.id,
            amount: totalAmount,
            platformFee: platformFee,
            payoutAmount: payoutAmount,
            creditsPurchased: creditAmount,
            pricePerCredit: project.pricePerCredit,
            status: "COMPLETED",
            paymentStatus: "CAPTURED",
            dodoSessionId: paymentResult.sessionId,
            paidAt: new Date(),
          }
        })
      );
    }

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
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return NextResponse.json({ 
        success: false, 
        error: "Database temporarily unavailable. Please try again."
      }, { status: 503 });
    }

    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        success: false, 
        error: "Investment record already exists."
      }, { status: 409 });
    }

    // Handle foreign key constraint errors
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid project or user reference."
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: `Failed to create investment: ${error.message}`
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

    // Get company record first
    const company = await withRetry(() => 
      prisma.company.findUnique({
        where: { clerkUserId: userId }
      })
    );

    if (!company) {
      return NextResponse.json({
        success: true,
        investments: [],
        summary: {
          totalInvestments: 0,
          totalInvested: 0,
          totalCredits: 0,
          successfulInvestments: 0,
          pendingInvestments: 0
        }
      });
    }

    const investments = await withRetry(() => 
      prisma.investment.findMany({
        where: { companyId: company.id }, // Use company.id instead of userId
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
