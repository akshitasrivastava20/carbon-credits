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

    // In production, add admin role check here
    // const user = await getUser(userId);
    // if (!user.isAdmin) return unauthorized

    // Get payout statistics
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalPayouts,
      recentPayouts,
      pendingPayouts,
      failedPayouts,
      completedPayouts,
      totalAmount,
    ] = await Promise.all([
      // Total payouts ever
      prisma.payout.count(),
      
      // Payouts in last 24 hours
      prisma.payout.count({
        where: {
          createdAt: { gte: last24Hours },
        },
      }),
      
      // Currently pending/scheduled payouts
      prisma.payout.count({
        where: {
          status: { in: ["PENDING", "SCHEDULED"] },
        },
      }),
      
      // Failed payouts
      prisma.payout.count({
        where: {
          status: "FAILED",
        },
      }),
      
      // Completed payouts
      prisma.payout.count({
        where: {
          status: "COMPLETED",
        },
      }),
      
      // Total amount processed
      prisma.payout.aggregate({
        where: {
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Get recent payout activity
    const recentActivity = await prisma.payout.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
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

    // Get payouts due for processing in next hour
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    const upcomingPayouts = await prisma.payout.findMany({
      where: {
        status: "SCHEDULED",
        scheduledDate: {
          lte: nextHour,
        },
      },
      orderBy: {
        scheduledDate: "asc",
      },
      take: 20,
      include: {
        project: {
          select: {
            title: true,
            projectDeveloper: true,
          },
        },
      },
    });

    const cronStatus = {
      // These would come from a cron monitoring system in production
      lastRun: recentActivity[0]?.createdAt || null,
      nextRun: upcomingPayouts[0]?.scheduledDate || null,
      isHealthy: pendingPayouts < 100, // Arbitrary health check
      averageProcessingTime: "2.3 seconds", // Would calculate from actual data
    };

    const statistics = {
      total: {
        payouts: totalPayouts,
        amount: totalAmount._sum.amount || 0,
      },
      recent: {
        payouts: recentPayouts,
        timeframe: "24 hours",
      },
      status: {
        pending: pendingPayouts,
        completed: completedPayouts,
        failed: failedPayouts,
        successRate: totalPayouts > 0 ? ((completedPayouts / totalPayouts) * 100).toFixed(1) : "0",
      },
      cron: cronStatus,
    };

    return NextResponse.json({
      success: true,
      data: {
        statistics,
        recentActivity: recentActivity.map(payout => ({
          id: payout.id,
          amount: payout.amount,
          status: payout.status,
          recipientEmail: payout.recipientEmail,
          projectTitle: payout.project?.title,
          projectDeveloper: payout.project?.projectDeveloper,
          investorName: payout.transaction?.investment?.company?.name,
          scheduledDate: payout.scheduledDate,
          payoutDate: payout.payoutDate,
          createdAt: payout.createdAt,
        })),
        upcomingPayouts: upcomingPayouts.map(payout => ({
          id: payout.id,
          amount: payout.amount,
          scheduledDate: payout.scheduledDate,
          projectTitle: payout.project?.title,
          recipientEmail: payout.recipientEmail,
          minutesUntilDue: Math.round((new Date(payout.scheduledDate).getTime() - now.getTime()) / (1000 * 60)),
        })),
      },
    });

  } catch (error: any) {
    console.error("Cron status fetch error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to fetch cron status",
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
