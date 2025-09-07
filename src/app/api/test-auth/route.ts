import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    
    return NextResponse.json({
      success: true,
      authenticated: !!userId,
      userId: userId,
      authResult: authResult
    });
  } catch (error: any) {
    console.error("Auth test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
