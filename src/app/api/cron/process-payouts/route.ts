import { NextRequest, NextResponse } from "next/server";
import { processPendingPayouts } from "@/lib/payout-processor";

// This endpoint should be called by a cron job every few minutes
// You can use services like Vercel Cron, GitHub Actions, or external cron services

export async function POST(req: NextRequest) {
  try {
    // Simple authentication - in production use proper API keys
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🔄 Starting payout processing job...");
    
    const results = await processPendingPayouts();
    
    console.log("✅ Payout processing completed:", results);
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("❌ Payout processing failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Allow GET for manual testing (remove in production)
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    console.log("🧪 Manual payout processing test...");
    
    const results = await processPendingPayouts();
    
    return NextResponse.json({
      success: true,
      data: results,
      message: "Manual payout processing completed",
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
