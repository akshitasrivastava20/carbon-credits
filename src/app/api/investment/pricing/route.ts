import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { getDodoClient } from "@/lib/dodo";
import { 
  getPaymentFlowData, 
  createTransaction, 
  createProjectProduct 
} from "@/lib/pricing";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { projectId, creditAmount, successUrl, cancelUrl } = body;

    // Validate input
    if (!projectId || !creditAmount || creditAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID or credit amount" },
        { status: 400 }
      );
    }

    // Get company/investor information
    const company = await prisma.company.findUnique({
      where: { clerkUserId: userId },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company profile required for investment" },
        { status: 400 }
      );
    }

    // Get payment flow data and pricing
    const paymentFlowData = await getPaymentFlowData(
      projectId,
      company.id,
      creditAmount
    );

    // Check if product exists in our database, create if needed
    let product = await prisma.product.findFirst({
      where: { projectId, isActive: true },
    });

    if (!product) {
      // For now, create a placeholder product
      // In production, you'd create this in Dodo dashboard first
      const dodoProductId = `carbon_credits_${projectId}_${Date.now()}`;
      product = await createProjectProduct(projectId, dodoProductId);
    }

    // Create investment record
    const investment = await prisma.investment.create({
      data: {
        companyId: company.id,
        projectId,
        creditsBought: creditAmount,
        totalPrice: paymentFlowData.pricing.totalAmount,
      },
    });

    // Create transaction record
    const transaction = await createTransaction(
      investment.id,
      product.id,
      company.id,
      paymentFlowData
    );

    try {
      // Create Dodo checkout session using proper API structure
      const dodo = getDodoClient();
      
      const checkoutParams = {
        product_cart: [
          {
            product_id: product.dodoProductId,
            quantity: creditAmount,
            amount: Math.round(paymentFlowData.pricing.totalAmount * 100), // Convert to cents
          }
        ],
        customer: {
          email: company.email,
          name: company.name,
        },
        metadata: {
          investment_id: investment.id,
          transaction_id: transaction.id,
          project_id: projectId,
          company_id: company.id,
          credit_amount: creditAmount.toString(),
          platform_fee: paymentFlowData.pricing.platformFee.toString(),
          payout_amount: paymentFlowData.pricing.payoutAmount.toString(),
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
      };

      const checkoutSession = await dodo.checkoutSessions.create(checkoutParams);

      // Update transaction with Dodo session ID
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { dodoSessionId: checkoutSession.session_id },
      });

      return NextResponse.json({
        success: true,
        data: {
          checkoutUrl: checkoutSession.checkout_url,
          sessionId: checkoutSession.session_id,
          pricing: paymentFlowData.pricing,
          projectHolder: paymentFlowData.projectHolder,
          transaction: {
            id: transaction.id,
            amount: transaction.amount,
            platformFee: transaction.platformFee,
            payoutAmount: transaction.payoutAmount,
          },
        },
      });

    } catch (dodoError: any) {
      console.error("Dodo payment creation failed:", dodoError);
      
      // Clean up created records if Dodo fails
      await prisma.transaction.delete({ where: { id: transaction.id } });
      await prisma.investment.delete({ where: { id: investment.id } });

      return NextResponse.json({
        success: false,
        error: "Payment system temporarily unavailable",
        details: dodoError.message,
      }, { status: 503 });
    }

  } catch (error: any) {
    console.error("Investment payment creation error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to create investment payment",
      details: error.message,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Get pricing calculation endpoint
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const creditAmount = searchParams.get('creditAmount');

    if (!projectId || !creditAmount) {
      return NextResponse.json(
        { success: false, error: "Missing projectId or creditAmount" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        pricePerCredit: true,
        availableCredits: true,
        platformFee: true,
        projectDeveloper: true,
        holderType: true,
        payoutSchedule: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const credits = parseInt(creditAmount);
    if (credits <= 0 || credits > project.availableCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid credit amount. Available: ${project.availableCredits}` 
        },
        { status: 400 }
      );
    }

    const subtotal = credits * project.pricePerCredit;
    const platformFee = (subtotal * project.platformFee) / 100;
    const totalAmount = subtotal + platformFee;

    return NextResponse.json({
      success: true,
      data: {
        projectId: project.id,
        projectTitle: project.title,
        projectDeveloper: project.projectDeveloper,
        creditAmount: credits,
        pricePerCredit: project.pricePerCredit,
        subtotal,
        platformFeeRate: project.platformFee,
        platformFee,
        totalAmount,
        payoutAmount: subtotal,
        holderType: project.holderType,
        payoutSchedule: project.payoutSchedule,
        availableCredits: project.availableCredits,
      },
    });

  } catch (error: any) {
    console.error("Pricing calculation error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to calculate pricing",
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
