import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const transactionId = searchParams.get('transactionId');

    if (!sessionId && !transactionId) {
      return NextResponse.json(
        { success: false, error: "Session ID or Transaction ID required" },
        { status: 400 }
      );
    }

    // Handle test mode sessions
    if (sessionId && sessionId.startsWith('test_session_')) {
      const testInvestmentDetails = {
        id: sessionId,
        creditsBought: 10,
        totalPrice: 250.00,
        project: {
          title: "Test Carbon Credit Investment",
          projectDeveloper: "Test Developer",
          pricePerCredit: 25.00,
        },
        transaction: {
          id: sessionId,
          amount: 250.00,
          platformFee: 12.50,
          payoutAmount: 237.50,
          status: "COMPLETED",
          paymentStatus: "CAPTURED",
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      };

      return NextResponse.json({
        success: true,
        data: testInvestmentDetails,
      });
    }

    // Get company information
    const company = await prisma.company.findUnique({
      where: { clerkUserId: userId },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company profile not found" },
        { status: 404 }
      );
    }

    // Find transaction by session ID or transaction ID
    let transaction;
    
    if (sessionId) {
      transaction = await prisma.transaction.findFirst({
        where: { 
          dodoSessionId: sessionId,
          companyId: company.id,
        },
        include: {
          investment: {
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  projectDeveloper: true,
                  pricePerCredit: true,
                },
              },
            },
          },
        },
      });
    } else if (transactionId) {
      transaction = await prisma.transaction.findFirst({
        where: { 
          id: transactionId,
          companyId: company.id,
        },
        include: {
          investment: {
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  projectDeveloper: true,
                  pricePerCredit: true,
                },
              },
            },
          },
        },
      });
    }

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Return investment details
    const investmentDetails = {
      id: transaction.investment.id,
      creditsBought: transaction.investment.creditsBought,
      totalPrice: transaction.investment.totalPrice,
      project: {
        title: transaction.investment.project.title,
        projectDeveloper: transaction.investment.project.projectDeveloper,
        pricePerCredit: transaction.investment.project.pricePerCredit,
      },
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        platformFee: transaction.platformFee,
        payoutAmount: transaction.payoutAmount,
        status: transaction.status,
        paymentStatus: transaction.paymentStatus,
        paidAt: transaction.paidAt?.toISOString() || "",
        createdAt: transaction.createdAt.toISOString(),
      },
    };

    return NextResponse.json({
      success: true,
      data: investmentDetails,
    });

  } catch (error: any) {
    console.error("Investment status fetch error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch investment status",
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
