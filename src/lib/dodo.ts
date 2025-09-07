import DodoPayments from 'dodopayments';
import crypto from 'crypto';

// Types for our carbon credit investment
export interface CarbonCreditInvestment {
  projectId: string;
  creditAmount: number;
  pricePerCredit: number;
  totalAmount: number;
  investorEmail: string;
  investorName: string;
}

// Helper to get API key with proper error handling
const getApiKey = () => {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY || process.env.DODO_API_KEY;
  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_API_KEY environment variable is missing or empty');
  }
  return apiKey;
};

// Initialize Dodo client lazily to avoid issues with environment variables
let dodoClient: DodoPayments | null = null;

export const getDodoClient = () => {
  if (!dodoClient) {
    dodoClient = new DodoPayments({
      bearerToken: getApiKey(),
      environment: process.env.NEXT_PUBLIC_DODO_MODE === 'live' ? 'live_mode' : 'test_mode'
    });
  }
  return dodoClient;
};

// Helper to calculate total investment amount
export const calculateInvestmentTotal = (creditAmount: number, pricePerCredit: number): number => {
  return creditAmount * pricePerCredit;
};

// Create checkout session for carbon credit investment
// For now, we'll use a simple approach where you create products manually in Dodo dashboard
export const createInvestmentPayment = async (
  investment: CarbonCreditInvestment,
  successUrl: string,
  cancelUrl: string
) => {
  try {
    // Check if we're in test mode and merchant test mode is not enabled
    const isTestMode = process.env.NEXT_PUBLIC_DODO_MODE !== 'live';
    
    if (isTestMode) {
      // For test mode, create a mock payment session that redirects to success
      console.log('Creating test mode payment session');
      return {
        url: `${successUrl}?test_payment=true&session_id=test_${Date.now()}`,
        sessionId: `test_session_${Date.now()}`,
        status: 'pending'
      };
    }

    // For live mode, use actual Dodo API
    const CARBON_CREDIT_PRODUCT_ID = "pdt_pTi3uI8TBUHEgRTqXT9Ep"; // Your actual Dodo product ID
    
    const checkoutParams: DodoPayments.CheckoutSessionCreateParams = {
      product_cart: [
        {
          product_id: CARBON_CREDIT_PRODUCT_ID,
          quantity: investment.creditAmount,
          // Use amount for pay-what-you-want pricing
          amount: Math.round(investment.pricePerCredit * 100), // Convert to cents
        }
      ],
      customer: {
        email: investment.investorEmail,
        name: investment.investorName,
      },
      metadata: {
        project_id: investment.projectId,
        credit_amount: investment.creditAmount.toString(),
        price_per_credit: investment.pricePerCredit.toString(),
        total_amount: investment.totalAmount.toString(),
        investment_type: 'carbon_credits',
        success_url: successUrl,
        cancel_url: cancelUrl
      }
    };

    const dodo = getDodoClient();
    const session = await dodo.checkoutSessions.create(checkoutParams);
    
    return {
      url: session.checkout_url,
      sessionId: session.session_id,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating Dodo checkout session:', error);
    
    // Provide specific error handling for mode issues
    if (error instanceof Error && error.message.includes('mode not enabled')) {
      throw new Error('Payment mode not enabled. Please contact support or try switching payment modes.');
    }
    
    throw new Error(`Payment session creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Alternative: Create a simple payment link for immediate use
export const createSimplePaymentLink = async (
  investment: CarbonCreditInvestment,
  successUrl: string
) => {
  try {
    // Create a direct payment link without requiring pre-existing products
    const totalAmount = Math.round(investment.totalAmount * 100); // Convert to cents
    
    // This is a simplified approach - you might need to adjust based on Dodo's actual API
    const paymentData = {
      amount: totalAmount,
      currency: 'USD',
      description: `Carbon Credits Investment - ${investment.creditAmount} credits from Project ${investment.projectId}`,
      customer_email: investment.investorEmail,
      customer_name: investment.investorName,
      success_url: successUrl,
      metadata: {
        project_id: investment.projectId,
        credit_amount: investment.creditAmount.toString(),
        price_per_credit: investment.pricePerCredit.toString(),
        investment_type: 'carbon_credits'
      }
    };

    // For now, return a test URL - you'll need to implement this based on Dodo's payment links API
    return {
      url: `https://test.dodopayments.com/pay/test-link-${Date.now()}`,
      sessionId: `test_session_${Date.now()}`,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating Dodo payment link:', error);
    throw new Error('Failed to create payment link');
  }
};

// Verify webhook signature using Dodo's method
export const verifyWebhookSignature = (payload: any, signature: string): boolean => {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("Webhook secret not configured");
    return false;
  }
  
  try {
    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    // Compare signatures (remove 'whsec_' prefix if present)
    const cleanSignature = signature.replace('whsec_', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
};

// Configuration object for Dodo Payments
export const dodoConfig = {
  apiKey: process.env.DODO_API_KEY || "",
  mode: process.env.NEXT_PUBLIC_DODO_MODE || "test",
  webhookSecret: process.env.DODO_WEBHOOK_SECRET || "",
};
