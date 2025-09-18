"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { calculateInvestmentTotal } from "@/lib/dodo";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    pricePerCredit: number;
    availableCredits: number;
    location: string;
  };
}

export default function InvestmentModal({ isOpen, onClose, project }: InvestmentModalProps) {
  const { user } = useUser();
  const [creditAmount, setCreditAmount] = useState<number>(1);
  const [investorName, setInvestorName] = useState<string>(user?.fullName || "");
  const [investorEmail, setInvestorEmail] = useState<string>(user?.primaryEmailAddress?.emailAddress || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const totalAmount = calculateInvestmentTotal(creditAmount, project.pricePerCredit);
  const maxCredits = Math.min(project.availableCredits, 1000); // Limit to 1000 for UI purposes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user) {
        setError("Please sign in to make an investment");
        return;
      }

      if (creditAmount <= 0) {
        setError("Please enter a valid number of credits");
        return;
      }

      if (creditAmount > project.availableCredits) {
        setError(`Only ${project.availableCredits} credits available`);
        return;
      }

      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          creditAmount,
          investorEmail,
          investorName
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment URL
        if (data.investment.paymentUrl) {
          window.location.href = data.investment.paymentUrl;
        } else {
          // For now, show success message (when we have real payment integration)
          alert(`Investment created successfully! Total: $${totalAmount.toFixed(2)}`);
          onClose();
        }
      } else {
        setError(data.error || "Failed to create investment");
      }
    } catch (error) {
      console.error("Investment error:", error);
      setError("Failed to process investment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[90] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Invest in Carbon Credits</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              disabled={loading}
            >
              ×
            </button>
          </div>

          {/* Project Info */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-2">📍 {project.location}</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price per Credit:</span>
              <span className="font-semibold text-green-600">${project.pricePerCredit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Credits:</span>
              <span className="font-semibold text-blue-600">{project.availableCredits.toLocaleString()}</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Investment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Investor Name */}
            <div>
              <label htmlFor="investorName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="investorName"
                value={investorName}
                onChange={(e) => setInvestorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            {/* Investor Email */}
            <div>
              <label htmlFor="investorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="investorEmail"
                value={investorEmail}
                onChange={(e) => setInvestorEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Credit Amount */}
            <div>
              <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Credits
              </label>
              <input
                type="number"
                id="creditAmount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                min="1"
                max={maxCredits}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter number of credits"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {maxCredits.toLocaleString()} credits
              </p>
            </div>

            {/* Investment Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Investment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">{creditAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Credit:</span>
                  <span className="font-medium">${project.pricePerCredit}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !user}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </form>

          {/* Sign-in prompt for non-authenticated users */}
          {!user && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                Please <a href="/sign-in" className="underline font-medium">sign in</a> to make an investment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
