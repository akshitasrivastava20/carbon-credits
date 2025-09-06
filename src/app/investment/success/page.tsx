"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Leaf, ArrowRight } from "lucide-react";

export default function InvestmentSuccessPage() {
  const searchParams = useSearchParams();
  const [projectDetails, setProjectDetails] = useState<any>(null);
  
  const projectId = searchParams.get("project");
  const credits = searchParams.get("credits");

  useEffect(() => {
    if (projectId) {
      // Fetch project details to show success information
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Investment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for investing in carbon credits
          </p>
        </div>

        {/* Investment Details */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="size-6 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-green-800">
              Your Investment
            </h2>
          </div>
          
          {projectDetails && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project:</span>
                <span className="font-medium text-gray-900">{projectDetails.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credits Purchased:</span>
                <span className="font-medium text-green-600">{credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Credit:</span>
                <span className="font-medium text-gray-900">${projectDetails.pricePerCredit}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total Investment:</span>
                <span className="font-semibold text-green-600">
                  ${(parseInt(credits || "0") * projectDetails.pricePerCredit).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {!projectDetails && (
            <div className="text-gray-600">
              <p>Credits Purchased: {credits}</p>
              <p>Loading project details...</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <div className="text-left bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Your carbon credits will be tracked in your dashboard</li>
              <li>• You'll get updates on the project's progress</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/credits"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>View My Credits</span>
              <ArrowRight className="ml-2 size-4" />
            </Link>
            
            <Link
              href="/projects"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse More Projects
            </Link>
            
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
