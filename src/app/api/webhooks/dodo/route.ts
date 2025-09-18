import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWebhookSignature } from "@/lib/dodo";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("dodo-signature");
    const body = await request.text();
    
    if (!signature) {
      console.error("No signature provided");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    try {
      const payload = JSON.parse(body);
      const isValid = verifyWebhookSignature(payload, signature);
      
      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }

      // Handle different webhook events
      switch (payload.type) {
        case "payment.succeeded":
          await handlePaymentSucceeded(payload);
          break;
        
        case "payment.failed":
          await handlePaymentFailed(payload);
          break;
        
        case "checkout.session.completed":
          await handleCheckoutCompleted(payload);
          break;
          
        default:
          console.log(`Unhandled webhook event: ${payload.type}`);
      }

      return NextResponse.json({ received: true });
      
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handlePaymentSucceeded(payload: any) {
  try {
    const { session_id, metadata } = payload.data;
    
    if (!metadata?.project_id || !metadata?.credit_amount) {
      console.error("Missing metadata in payment webhook");
      return;
    }

    // Update investment status in database
    const investment = await prisma.investment.findFirst({
      where: {
        // paymentSessionId: session_id // Enable when schema is updated
        projectId: metadata.project_id,
        creditsBought: parseInt(metadata.credit_amount)
      }
    });

    if (investment) {
      // Update investment status (when payment status is added to schema)
      // await prisma.investment.update({
      //   where: { id: investment.id },
      //   data: { paymentStatus: "completed" }
      // });

      // Update project available credits
      await prisma.project.update({
        where: { id: metadata.project_id },
        data: {
          availableCredits: {
            decrement: parseInt(metadata.credit_amount)
          }
        }
      });

      console.log(`Payment succeeded for investment ${investment.id}`);
    } else {
      console.error("Investment not found for payment session:", session_id);
    }

  } catch (error) {
    console.error("Error handling payment success:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function handlePaymentFailed(payload: any) {
  try {
    const { session_id, metadata } = payload.data;
    
    // Update investment status to failed (when schema supports it)
    // const investment = await prisma.investment.findFirst({
    //   where: { paymentSessionId: session_id }
    // });
    
    // if (investment) {
    //   await prisma.investment.update({
    //     where: { id: investment.id },
    //     data: { paymentStatus: "failed" }
    //   });
    // }

    console.log(`Payment failed for session: ${session_id}`);

  } catch (error) {
    console.error("Error handling payment failure:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutCompleted(payload: any) {
  try {
    const { session_id, metadata } = payload.data;
    
    // Additional logic for checkout completion
    console.log(`Checkout completed for session: ${session_id}`);

  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}
