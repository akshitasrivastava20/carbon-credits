import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PricingCalculation {
  creditAmount: number;
  pricePerCredit: number;
  subtotal: number;
  platformFeeRate: number;
  platformFee: number;
  totalAmount: number;
  payoutAmount: number;
}

export interface PaymentFlowData {
  projectId: string;
  investorId: string;
  creditAmount: number;
  pricing: PricingCalculation;
  projectHolder: {
    id: string;
    type: string;
    paymentEmail: string;
    payoutSchedule: string;
  };
}

/**
 * Calculate pricing breakdown for carbon credit investment
 */
export const calculatePricing = (
  creditAmount: number,
  pricePerCredit: number,
  platformFeeRate: number = 2.5
): PricingCalculation => {
  const subtotal = creditAmount * pricePerCredit;
  const platformFee = (subtotal * platformFeeRate) / 100;
  const totalAmount = subtotal + platformFee;
  const payoutAmount = subtotal; // Project holder gets full subtotal, platform fee is added on top

  return {
    creditAmount,
    pricePerCredit,
    subtotal,
    platformFeeRate,
    platformFee,
    totalAmount,
    payoutAmount,
  };
};

/**
 * Get payment flow information for a project investment
 */
export const getPaymentFlowData = async (
  projectId: string,
  investorId: string,
  creditAmount: number
): Promise<PaymentFlowData> => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      pricePerCredit: true,
      availableCredits: true,
      platformFee: true,
      holderId: true,
      holderType: true,
      paymentEmail: true,
      payoutSchedule: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (creditAmount > project.availableCredits) {
    throw new Error(`Only ${project.availableCredits} credits available`);
  }

  const pricing = calculatePricing(
    creditAmount,
    project.pricePerCredit,
    project.platformFee
  );

  return {
    projectId: project.id,
    investorId,
    creditAmount,
    pricing,
    projectHolder: {
      id: project.holderId || "unknown",
      type: project.holderType,
      paymentEmail: project.paymentEmail || "",
      payoutSchedule: project.payoutSchedule,
    },
  };
};

/**
 * Create a product in the database for Dodo Payments integration
 */
export const createProjectProduct = async (
  projectId: string,
  dodoProductId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      description: true,
      pricePerCredit: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return await prisma.product.create({
    data: {
      projectId: project.id,
      dodoProductId,
      name: `Carbon Credits - ${project.title}`,
      description: project.description.substring(0, 500), // Limit description length
      price: project.pricePerCredit,
      currency: "USD",
      isActive: true,
    },
  });
};

/**
 * Create a transaction record for tracking payment flow
 */
export const createTransaction = async (
  investmentId: string,
  productId: string,
  companyId: string,
  paymentFlowData: PaymentFlowData,
  dodoSessionId?: string
) => {
  return await prisma.transaction.create({
    data: {
      investmentId,
      productId,
      companyId,
      dodoSessionId,
      amount: paymentFlowData.pricing.totalAmount,
      platformFee: paymentFlowData.pricing.platformFee,
      payoutAmount: paymentFlowData.pricing.payoutAmount,
      creditsPurchased: paymentFlowData.creditAmount,
      pricePerCredit: paymentFlowData.pricing.pricePerCredit,
      status: "PENDING",
      paymentStatus: "PENDING",
      payoutStatus: "PENDING",
    },
  });
};

/**
 * Schedule payout to project holder
 */
export const schedulePayout = async (
  transactionId: string,
  projectId: string,
  amount: number,
  recipientEmail: string,
  payoutSchedule: string
) => {
  let scheduledDate = new Date();
  
  // Calculate scheduled date based on payout schedule
  switch (payoutSchedule) {
    case "IMMEDIATE":
      // Schedule for immediate processing (next minute)
      scheduledDate = new Date(Date.now() + 60 * 1000);
      break;
    case "WEEKLY":
      // Schedule for next Friday
      const daysUntilFriday = (5 - scheduledDate.getDay() + 7) % 7;
      scheduledDate.setDate(scheduledDate.getDate() + (daysUntilFriday || 7));
      break;
    case "MONTHLY":
      // Schedule for first day of next month
      scheduledDate = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth() + 1, 1);
      break;
    case "MILESTONE":
      // Schedule for 7 days from now (manual review)
      scheduledDate.setDate(scheduledDate.getDate() + 7);
      break;
    default:
      // Default to immediate
      scheduledDate = new Date(Date.now() + 60 * 1000);
  }

  return await prisma.payout.create({
    data: {
      projectId,
      transactionId,
      amount,
      currency: "USD",
      payoutMethod: "BANK_TRANSFER",
      recipientEmail,
      status: "SCHEDULED",
      scheduledDate,
    },
  });
};

/**
 * Process successful payment and trigger payout
 */
export const processSuccessfulPayment = async (
  transactionId: string,
  dodoPaymentId: string
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      investment: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Update transaction status
  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      dodoPaymentId,
      status: "COMPLETED",
      paymentStatus: "CAPTURED",
      paidAt: new Date(),
    },
  });

  // Update project available credits
  await prisma.project.update({
    where: { id: transaction.investment.projectId },
    data: {
      availableCredits: {
        decrement: transaction.creditsPurchased,
      },
    },
  });

  // Schedule payout to project holder
  const project = transaction.investment.project;
  if (project.paymentEmail) {
    await schedulePayout(
      transactionId,
      project.id,
      transaction.payoutAmount,
      project.paymentEmail,
      project.payoutSchedule
    );
  }

  return updatedTransaction;
};

/**
 * Get transaction summary for dashboard
 */
export const getTransactionSummary = async (projectId?: string, companyId?: string) => {
  const whereClause: any = {};
  
  if (projectId) {
    whereClause.investment = {
      projectId,
    };
  }
  
  if (companyId) {
    whereClause.companyId = companyId;
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    include: {
      investment: {
        include: {
          project: {
            select: {
              title: true,
              projectType: true,
            },
          },
        },
      },
      company: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const summary = transactions.reduce(
    (acc, transaction) => {
      acc.totalTransactions += 1;
      acc.totalAmount += transaction.amount;
      acc.totalPlatformFees += transaction.platformFee;
      acc.totalPayouts += transaction.payoutAmount;
      acc.totalCredits += transaction.creditsPurchased;

      if (transaction.status === "COMPLETED") {
        acc.completedTransactions += 1;
      }

      return acc;
    },
    {
      totalTransactions: 0,
      completedTransactions: 0,
      totalAmount: 0,
      totalPlatformFees: 0,
      totalPayouts: 0,
      totalCredits: 0,
    }
  );

  return { summary, transactions };
};
