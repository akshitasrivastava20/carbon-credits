import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient } from "@/generated/prisma";
import { verifyWebhookSignature } from "@/lib/dodo";
import { processSuccessfulPayment } from "@/lib/pricing";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("dodo-signature") || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(JSON.parse(body), signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    console.log(`Processing Dodo webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data);
        break;
      
      case "checkout.session.expired":
        await handleCheckoutExpired(event.data);
        break;
      
      case "payment.succeeded":
        await handlePaymentSucceeded(event.data);
        break;
      
      case "payment.failed":
        await handlePaymentFailed(event.data);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutCompleted(sessionData: any) {
  try {
    const { metadata, id: sessionId } = sessionData;
    
    // Find transaction by Dodo session ID
    const transaction = await prisma.transaction.findFirst({
      where: { dodoSessionId: sessionId },
      include: {
        investment: {
          include: {
            project: true,
            company: true,
          },
        },
        product: true,
      },
    });

    if (!transaction) {
      console.error(`Transaction not found for session: ${sessionId}`);
      return;
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "COMPLETED",
        paymentStatus: "CAPTURED",
        paidAt: new Date(),
        dodoPaymentId: sessionData.payment_intent || sessionData.payment_id,
      },
    });

    // Update project available credits
    await prisma.project.update({
      where: { id: transaction.investment.projectId },
      data: {
        availableCredits: {
          decrement: transaction.investment.creditsBought,
        },
      },
    });

    // Process successful payment (schedule payout, etc.)
    await processSuccessfulPayment(
      transaction.investment.id, 
      transaction.id
    );

    console.log(`Successfully processed checkout completion for transaction: ${transaction.id}`);

  } catch (error) {
    console.error("Error handling checkout completed:", error);
    throw error;
  }
}

async function handleCheckoutExpired(sessionData: any) {
  try {
    const { id: sessionId } = sessionData;
    
    // Find and update transaction
    const transaction = await prisma.transaction.findFirst({
      where: { dodoSessionId: sessionId },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          paymentStatus: "FAILED",
        },
      });

      console.log(`Checkout session expired for transaction: ${transaction.id}`);
    }

  } catch (error) {
    console.error("Error handling checkout expired:", error);
    throw error;
  }
}

async function handlePaymentSucceeded(paymentData: any) {
  try {
    const { id: paymentId, metadata } = paymentData;
    
    // Find transaction by payment ID or metadata
    let transaction = await prisma.transaction.findFirst({
      where: { dodoPaymentId: paymentId },
    });

    if (!transaction && metadata?.transaction_id) {
      transaction = await prisma.transaction.findUnique({
        where: { id: metadata.transaction_id },
      });
    }

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          paymentStatus: "CAPTURED",
          paidAt: new Date(),
          dodoPaymentId: paymentId,
        },
      });

      console.log(`Payment succeeded for transaction: ${transaction.id}`);
    }

  } catch (error) {
    console.error("Error handling payment succeeded:", error);
    throw error;
  }
}

async function handlePaymentFailed(paymentData: any) {
  try {
    const { id: paymentId, metadata, failure_reason } = paymentData;
    
    // Find transaction by payment ID or metadata
    let transaction = await prisma.transaction.findFirst({
      where: { dodoPaymentId: paymentId },
    });

    if (!transaction && metadata?.transaction_id) {
      transaction = await prisma.transaction.findUnique({
        where: { id: metadata.transaction_id },
      });
    }

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          paymentStatus: "FAILED",
        },
      });

      console.log(`Payment failed for transaction: ${transaction.id}, reason: ${failure_reason}`);
    }

  } catch (error) {
    console.error("Error handling payment failed:", error);
    throw error;
  }
}
