import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  projectDeveloper: string;
  description: string;
  pricePerCredit: number;
  availableCredits: number;
  platformFee: number;
  holderType: string;
  payoutSchedule: string;
  images: string[];
  location: string;
  verificationStandard: string;
}

interface PricingData {
  projectId: string;
  projectTitle: string;
  projectDeveloper: string;
  creditAmount: number;
  pricePerCredit: number;
  subtotal: number;
  platformFeeRate: number;
  platformFee: number;
  totalAmount: number;
  payoutAmount: number;
  holderType: string;
  payoutSchedule: string;
  availableCredits: number;
}

export default function ProjectInvestmentModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [creditAmount, setCreditAmount] = useState<number>(1);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const router = useRouter();

  // Calculate pricing when credit amount changes
  useEffect(() => {
    if (creditAmount > 0 && creditAmount <= project.availableCredits) {
      fetchPricing();
    } else {
      setPricing(null);
    }
  }, [creditAmount, project.id]);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(
        `/api/investment/pricing?projectId=${project.id}&creditAmount=${creditAmount}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setPricing(result.data);
      } else {
        setError(result.error || "Failed to calculate pricing");
      }
    } catch (err) {
      setError("Failed to fetch pricing information");
      console.error("Pricing fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestment = async () => {
    if (!pricing || creditAmount <= 0) return;

    try {
      setProcessingPayment(true);
      setError("");

      const response = await fetch('/api/investment/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          creditAmount,
          successUrl: `${window.location.origin}/investment/success`,
          cancelUrl: `${window.location.origin}/investment/cancel`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Dodo checkout
        window.location.href = result.data.checkoutUrl;
      } else {
        setError(result.error || "Failed to create payment session");
      }
    } catch (err) {
      setError("Failed to process investment");
      console.error("Investment error:", err);
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatSchedule = (schedule: string) => {
    return schedule.toLowerCase().replace('_', ' ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[90]">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Invest in {project.title}
              </h2>
              <p className="text-gray-600">
                By {project.projectDeveloper} • {project.location}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Project Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Credit:</span>
                <span className="font-semibold">
                  {formatCurrency(project.pricePerCredit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Credits:</span>
                <span className="font-semibold">
                  {project.availableCredits.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verification Standard:</span>
                <Badge variant="outline">{project.verificationStandard}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payout Schedule:</span>
                <Badge variant="secondary">
                  {formatSchedule(project.payoutSchedule)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Investment Amount */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Investment Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Credits
                </label>
                <input
                  type="number"
                  min="1"
                  max={project.availableCredits}
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter number of credits"
                />
                {creditAmount > project.availableCredits && (
                  <p className="text-red-500 text-sm mt-1">
                    Cannot exceed {project.availableCredits} available credits
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          {loading && (
            <Card className="mb-6">
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  Calculating pricing...
                </div>
              </CardContent>
            </Card>
          )}

          {pricing && !loading && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {pricing.creditAmount} credits × {formatCurrency(pricing.pricePerCredit)}
                  </span>
                  <span>{formatCurrency(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Platform Fee ({pricing.platformFeeRate}%)
                  </span>
                  <span>{formatCurrency(pricing.platformFee)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(pricing.totalAmount)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {formatCurrency(pricing.payoutAmount)} will be paid to the project developer
                  via {formatSchedule(pricing.payoutSchedule)} schedule
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvestment}
              disabled={
                !pricing || 
                creditAmount <= 0 || 
                creditAmount > project.availableCredits || 
                processingPayment ||
                loading
              }
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Invest ${pricing ? formatCurrency(pricing.totalAmount) : ''}`
              )}
            </button>
          </div>

          {/* Terms */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            By proceeding, you agree to our Terms of Service and acknowledge that
            carbon credit investments carry inherent risks.
          </div>
        </div>
      </div>
    </div>
  );
}
