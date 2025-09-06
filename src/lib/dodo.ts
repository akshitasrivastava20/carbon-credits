// Dodo Payments configuration and helper functions
// Note: This is a basic setup - will need to be refined based on actual API testing

// Types for our carbon credit investment
export interface CarbonCreditInvestment {
  projectId: string;
  creditAmount: number;
  pricePerCredit: number;
  totalAmount: number;
  investorEmail: string;
  investorName: string;
}

// Helper function to get base URL based on environment
export const getDodoBaseUrl = () => {
  const mode = process.env.NEXT_PUBLIC_DODO_MODE || "test";
  return mode === "live" 
    ? "https://live.dodopayments.com" 
    : "https://test.dodopayments.com";
};

// Helper to calculate total investment amount
export const calculateInvestmentTotal = (creditAmount: number, pricePerCredit: number): number => {
  return creditAmount * pricePerCredit;
};

// Mock function for creating payment (will be replaced with actual Dodo integration)
export const createInvestmentPayment = async (
  investment: CarbonCreditInvestment,
  successUrl: string,
  cancelUrl: string
) => {
  // For now, return a mock payment URL
  // In production, this will use the actual Dodo API
  return {
    url: `${getDodoBaseUrl()}/checkout/mock-session-id`,
    sessionId: "mock-session-id",
    status: "pending"
  };
};

// Verify webhook signature placeholder
export const verifyWebhookSignature = (payload: any, signature: string): boolean => {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("Webhook secret not configured");
    return false;
  }
  
  // Placeholder - implement actual verification when we have the correct API
  return true;
};

// Configuration object for Dodo Payments
export const dodoConfig = {
  apiKey: process.env.DODO_API_KEY || "",
  mode: process.env.NEXT_PUBLIC_DODO_MODE || "test",
  webhookSecret: process.env.DODO_WEBHOOK_SECRET || "",
  baseUrl: getDodoBaseUrl()
};
