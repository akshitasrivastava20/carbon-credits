import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { retryPayout, getPayoutStatus } from "@/lib/payout-processor";

const prisma = new PrismaClient();

// Get payout status
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
    const transactionId = searchParams.get('transactionId');
    const payoutId = searchParams.get('payoutId');

    if (transactionId) {
      const payout = await getPayoutStatus(transactionId);
      return NextResponse.json({
        success: true,
        data: payout,
      });
    }

    if (payoutId) {
      const payout = await prisma.payout.findUnique({
        where: { id: payoutId },
        include: {
          project: {
            select: {
              title: true,
              projectDeveloper: true,
            },
          },
          transaction: {
            include: {
              investment: {
                include: {
                  company: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: payout,
      });
    }

    return NextResponse.json(
      { success: false, error: "Either transactionId or payoutId required" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Payout status fetch error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch payout status",
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Retry failed payout
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // In production, add admin role check here
    // const user = await getUser(userId);
    // if (!user.isAdmin) return unauthorized

    const body = await req.json();
    const { payoutId } = body;

    if (!payoutId) {
      return NextResponse.json(
        { success: false, error: "Payout ID required" },
        { status: 400 }
      );
    }

    console.log(`🔄 Manual payout retry for: ${payoutId}`);
    
    const result = await retryPayout(payoutId);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: "Payout retry completed successfully",
    });

  } catch (error: any) {
    console.error("Payout retry error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
