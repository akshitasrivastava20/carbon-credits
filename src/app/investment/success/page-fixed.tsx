'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface InvestmentDetails {
  id: string;
  creditsBought: number;
  totalPrice: number;
  project: {
    title: string;
    projectDeveloper: string;
    pricePerCredit: number;
  };
  transaction: {
    id: string;
    amount: number;
    platformFee: number;
    payoutAmount: number;
    status: string;
    paidAt: string;
  };
}

function InvestmentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [investmentDetails, setInvestmentDetails] = useState<InvestmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      fetchInvestmentDetails(sessionId);
    } else {
      setError("Invalid payment session");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchInvestmentDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/investment/status?sessionId=${sessionId}`);
      const result = await response.json();

      if (result.success) {
        setInvestmentDetails(result.data);
      } else {
        setError(result.error || "Failed to fetch investment details");
      }
    } catch (err) {
      setError("Failed to load investment information");
      console.error("Investment details fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your investment...</p>
        </div>
      </div>
    );
  }

  if (error || !investmentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Verify Payment
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/projects')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Return to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your contribution to carbon offset initiatives.
          </p>
        </div>

        {/* Investment Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
              <p className="text-lg font-medium">{investmentDetails.project.title}</p>
              <p className="text-gray-600">by {investmentDetails.project.projectDeveloper}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Investment Details</h3>
              <p className="text-lg">
                <span className="font-semibold">{investmentDetails.creditsBought}</span> carbon credits
              </p>
              <p className="text-gray-600">
                at {formatCurrency(investmentDetails.project.pricePerCredit)} per credit
              </p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {investmentDetails.creditsBought} credits × {formatCurrency(investmentDetails.project.pricePerCredit)}
              </span>
              <span>{formatCurrency(investmentDetails.totalPrice - investmentDetails.transaction.platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee</span>
              <span>{formatCurrency(investmentDetails.transaction.platformFee)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Paid</span>
              <span>{formatCurrency(investmentDetails.transaction.amount)}</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatCurrency(investmentDetails.transaction.payoutAmount)} will be transferred to the project developer
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm">{investmentDetails.transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Date:</span>
              <span>{formatDate(investmentDetails.transaction.paidAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                {investmentDetails.transaction.status}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Certificate Generation</h4>
                <p className="text-gray-600 text-sm">
                  Your carbon credit certificate will be generated and sent to your email within 24-48 hours.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Project Updates</h4>
                <p className="text-gray-600 text-sm">
                  You'll receive regular updates about the project's progress and environmental impact.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Track Your Impact</h4>
                <p className="text-gray-600 text-sm">
                  Monitor your carbon offset portfolio and environmental impact in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/credits')}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View My Credits
          </button>
          <button
            onClick={() => router.push('/projects')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Explore More Projects
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InvestmentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <InvestmentSuccessContent />
    </Suspense>
  );
}
