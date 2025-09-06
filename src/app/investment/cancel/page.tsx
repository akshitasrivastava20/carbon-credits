"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function InvestmentCancelPage() {
  const searchParams = useSearchParams();
  const [projectDetails, setProjectDetails] = useState<any>(null);
  
  const projectId = searchParams.get("project");

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId);
    }
  }, [projectId]);

  const fetchProjectDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/projects`);
      const data = await response.json();
      
      if (data.success) {
        const project = data.projects.find((p: any) => p.id === id);
        setProjectDetails(project);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="mb-6">
          <XCircle className="size-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Investment Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment was cancelled and no charges were made
          </p>
        </div>

        {/* Project Info */}
        {projectDetails && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {projectDetails.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              📍 {projectDetails.location}
            </p>
            <p className="text-sm text-gray-700">
              This project is still available for investment. 
              {projectDetails.availableCredits.toLocaleString()} credits remain at ${projectDetails.pricePerCredit} each.
            </p>
          </div>
        )}

        {/* What Happened */}
        <div className="text-left bg-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-orange-900 mb-2">What Happened?</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Your payment was not processed</li>
            <li>• No credits were reserved or purchased</li>
            <li>• You can try investing again anytime</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {projectDetails && (
            <Link
              href={`/projects`}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="mr-2 size-4" />
              <span>Try Again</span>
            </Link>
          )}
          
          <Link
            href="/projects"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2 size-4" />
            <span>Browse Projects</span>
          </Link>
          
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-green-600 font-semibold hover:text-green-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your investment?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="mailto:support@carbonCredits.com" className="text-green-600 hover:text-green-700">
              Contact Support
            </a>
            <span className="text-gray-400">•</span>
            <a href="/faq" className="text-green-600 hover:text-green-700">
              View FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
