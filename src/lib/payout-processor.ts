import { PrismaClient } from "@/generated/prisma";
import { getDodoClient } from "./dodo";

const prisma = new PrismaClient();

/**
 * Process all pending payouts that are due
 * This should be run by a scheduled job (cron) every few minutes
 */
export const processPendingPayouts = async () => {
  console.log("Processing pending payouts...");
  
  try {
    // Get all payouts that are due for processing
    const duePendingPayouts = await prisma.payout.findMany({
      where: {
        status: "SCHEDULED",
        scheduledDate: {
          lte: new Date(), // Due now or in the past
        },
      },
      include: {
        project: {
          select: {
            title: true,
            projectDeveloper: true,
            holderType: true,
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
      orderBy: {
        scheduledDate: "asc",
      },
      take: 50, // Process in batches
    });

    console.log(`Found ${duePendingPayouts.length} payouts to process`);

    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const payout of duePendingPayouts) {
      try {
        await processPayout(payout);
        results.processed++;
        console.log(`✅ Processed payout ${payout.id} for $${payout.amount}`);
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Payout ${payout.id}: ${error.message}`);
        console.error(`❌ Failed to process payout ${payout.id}:`, error);
        
        // Mark payout as failed
        await prisma.payout.update({
          where: { id: payout.id },
          data: {
            status: "FAILED",
            payoutDate: new Date(),
          },
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error in processPendingPayouts:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Process a single payout
 */
async function processPayout(payout: any) {
  // Update status to processing
  await prisma.payout.update({
    where: { id: payout.id },
    data: {
      status: "PROCESSING",
      payoutDate: new Date(),
    },
  });

  // Choose payment method based on holder type and amount
  const paymentMethod = determinePaymentMethod(payout);
  
  let paymentResult;
  
  switch (paymentMethod) {
    case "DODO_TRANSFER":
      paymentResult = await processDodoTransfer(payout);
      break;
    case "BANK_TRANSFER":
      paymentResult = await processBankTransfer(payout);
      break;
    case "CRYPTO_TRANSFER":
      paymentResult = await processCryptoTransfer(payout);
      break;
    default:
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
  }

  // Update payout with successful completion
  await prisma.payout.update({
    where: { id: payout.id },
    data: {
      status: "COMPLETED",
      payoutDate: new Date(),
      providerPayoutId: paymentResult.paymentId,
      providerResponse: {
        actualAmount: paymentResult.actualAmount,
        fees: paymentResult.fees,
        method: paymentResult.method,
      },
    },
  });

  // Send notification to project holder
  await sendPayoutNotification(payout, paymentResult);

  return paymentResult;
}

/**
 * Determine the best payment method for a payout
 */
function determinePaymentMethod(payout: any): string {
  // You can implement logic based on:
  // - Amount size (small amounts → crypto, large → bank)
  // - Holder type (individual vs company)
  // - Geographic location
  // - Holder preferences
  
  if (payout.amount >= 1000) {
    return "BANK_TRANSFER"; // Large amounts via bank
  } else if (payout.amount >= 100) {
    return "DODO_TRANSFER"; // Medium amounts via Dodo
  } else {
    return "CRYPTO_TRANSFER"; // Small amounts via crypto
  }
}

/**
 * Process payout via Dodo Payments
 */
async function processDodoTransfer(payout: any) {
  try {
    // For now, simulate Dodo payout API call
    // In production, you'd implement actual Dodo payout API
    console.log(`💳 Processing Dodo transfer for ${payout.recipientEmail}: $${payout.amount}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful transfer
    const transferId = `dodo_payout_${Date.now()}`;
    
    return {
      paymentId: transferId,
      actualAmount: payout.amount - (payout.amount * 0.025), // 2.5% Dodo fee
      fees: payout.amount * 0.025,
      method: "DODO_TRANSFER",
    };
  } catch (error: any) {
    throw new Error(`Dodo transfer failed: ${error.message}`);
  }
}

/**
 * Process payout via bank transfer
 */
async function processBankTransfer(payout: any) {
  // This would integrate with a bank API like Stripe Connect, Wise, or similar
  // For now, we'll simulate the process
  
  console.log(`🏦 Processing bank transfer for ${payout.recipientEmail}: $${payout.amount}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, you'd:
  // 1. Validate recipient bank details
  // 2. Create transfer via banking API
  // 3. Handle compliance checks
  // 4. Return actual transfer details
  
  return {
    paymentId: `bank_${Date.now()}`,
    actualAmount: payout.amount - (payout.amount * 0.01), // 1% bank fee
    fees: payout.amount * 0.01,
    method: "BANK_TRANSFER",
  };
}

/**
 * Process payout via cryptocurrency
 */
async function processCryptoTransfer(payout: any) {
  // This would integrate with a crypto payment processor
  // For now, we'll simulate the process
  
  console.log(`₿ Processing crypto transfer for ${payout.recipientEmail}: $${payout.amount}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    paymentId: `crypto_${Date.now()}`,
    actualAmount: payout.amount - 2.50, // Fixed $2.50 crypto fee
    fees: 2.50,
    method: "CRYPTO_TRANSFER",
  };
}

/**
 * Send notification to project holder about successful payout
 */
async function sendPayoutNotification(payout: any, paymentResult: any) {
  // This would send email/SMS notifications
  console.log(`📧 Sending payout notification to ${payout.recipientEmail}`);
  
  const emailContent = {
    to: payout.recipientEmail,
    subject: `Payment Received - ${payout.project.title}`,
    html: `
      <h2>Payment Received!</h2>
      <p>You've received a payment for your carbon credit project.</p>
      
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Project:</strong> ${payout.project.title}</li>
        <li><strong>Amount:</strong> $${paymentResult.actualAmount.toFixed(2)}</li>
        <li><strong>Fees:</strong> $${paymentResult.fees.toFixed(2)}</li>
        <li><strong>Method:</strong> ${paymentResult.method}</li>
        <li><strong>Payment ID:</strong> ${paymentResult.paymentId}</li>
        <li><strong>Investor:</strong> ${payout.transaction.investment.company.name}</li>
      </ul>
      
      <p>Thank you for your contribution to carbon offset initiatives!</p>
    `,
  };
  
  // In production, send via email service like SendGrid, AWS SES, etc.
  console.log("Email would be sent:", emailContent);
}

/**
 * Get payout status for a specific transaction
 */
export const getPayoutStatus = async (transactionId: string) => {
  const payout = await prisma.payout.findFirst({
    where: { transactionId },
    include: {
      project: {
        select: {
          title: true,
          projectDeveloper: true,
        },
      },
    },
  });

  return payout;
};

/**
 * Manual payout retry for failed payouts
 */
export const retryPayout = async (payoutId: string) => {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      project: true,
      transaction: {
        include: {
          investment: {
            include: {
              company: true,
            },
          },
        },
      },
    },
  });

  if (!payout) {
    throw new Error("Payout not found");
  }

  if (payout.status === "COMPLETED") {
    throw new Error("Payout already completed");
  }

  // Reset payout to scheduled
  await prisma.payout.update({
    where: { id: payoutId },
    data: {
      status: "SCHEDULED",
      scheduledDate: new Date(), // Process immediately
    },
  });

  // Process it
  return await processPayout(payout);
};
