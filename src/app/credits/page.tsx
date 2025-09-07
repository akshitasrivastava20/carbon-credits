"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface CompanyData {
  id: string;
  name: string;
  industry: string;
  email: string;
  status: string;
  createdAt: string;
}

interface Credits {
  totalKgCO2: number;
  totalTons: number;
  creditsNeeded: number;
}

interface Usage {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
}

interface Summary {
  totalUsageRecords: number;
  estimatedCost: number;
  environmentalImpact: string;
}

interface CreditsResponse {
  success: boolean;
  company: CompanyData;
  credits: Credits;
  usages: Usage[];
  summary: Summary;
}

// New interfaces for investments
interface Investment {
  id: string;
  creditsBought: number;
  totalPrice: number;
  createdAt: string;
  project: {
    id: string;
    title: string;
    description: string;
    location: string;
    projectImages: string[];
  };
}

interface InvestmentSummary {
  totalInvestments: number;
  totalInvested: number;
  totalCredits: number;
  successfulInvestments: number;
  pendingInvestments: number;
}

interface InvestmentsResponse {
  success: boolean;
  investments: Investment[];
  summary: InvestmentSummary;
}

export default function CreditsPage() {
  const { user } = useUser();
  const [creditsData, setCreditsData] = useState<CreditsResponse | null>(null);
  const [investmentsData, setInvestmentsData] = useState<InvestmentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        // Fetch both credits and investments data
        const [creditsResponse, investmentsResponse] = await Promise.all([
          fetch(`/api/credits/me`),
          fetch(`/api/investments`)
        ]);
        
        const creditsData = await creditsResponse.json();
        const investmentsData = await investmentsResponse.json();
        
        if (creditsData.success) {
          setCreditsData(creditsData);
        }
        
        if (investmentsData.success) {
          setInvestmentsData(investmentsData);
        }
        
        if (!creditsData.success && !investmentsData.success) {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Network error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Calculating carbon credits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full p-8 shadow-2xl rounded-2xl bg-white bg-opacity-95 backdrop-blur-sm border border-white border-opacity-30 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              Go to Registration
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!creditsData) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const { company, credits, usages, summary } = creditsData;

  return (
    <div className="min-h-screen pt-20 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Carbon Credits Report</h1>
          <p className="text-xl text-gray-600">Comprehensive environmental impact analysis for <span className="font-semibold text-green-600">{company.name}</span></p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
          {/* CO2 Emissions Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl shadow-xl p-6 border border-red-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-200 px-2 py-1 rounded-full">EMISSIONS</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total CO₂</h3>
            <p className="text-3xl font-bold text-red-600 mb-1">{credits.totalKgCO2.toFixed(2)}</p>
            <p className="text-sm text-gray-600">kg ({credits.totalTons.toFixed(4)} tons)</p>
          </div>

          {/* Credits Needed Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-6 border border-green-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">OFFSET</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Credits Needed</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">{credits.creditsNeeded}</p>
            <p className="text-sm text-gray-600">Carbon offset credits</p>
          </div>

          {/* Cost Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl p-6 border border-blue-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">COST</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Estimated Cost</h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">${summary.estimatedCost}</p>
            <p className="text-sm text-gray-600">For carbon credits</p>
          </div>

          {/* Usage Records Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-xl p-6 border border-purple-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">DATA</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Usage Records</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">{summary.totalUsageRecords}</p>
            <p className="text-sm text-gray-600">Energy sources tracked</p>
          </div>
        </div>

        {/* Company Information and Usage Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Company Information Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white border-opacity-30">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Company Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Company Name</span>
                <span className="text-gray-800 font-semibold">{company.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Industry</span>
                <span className="text-gray-800 font-semibold capitalize">{company.industry}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="text-gray-800 font-semibold">{company.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  company.status === 'approved' ? 'bg-green-100 text-green-800' :
                  company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {company.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Registered</span>
                <span className="text-gray-800 font-semibold">{new Date(company.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Energy Usage Details Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white border-opacity-30">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Energy Usage Details</h2>
            </div>
            
            <div className="space-y-4">
              {usages.map((usage, index) => (
                <div key={usage.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                        usage.type === 'ELECTRICITY' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {usage.type === 'ELECTRICITY' ? (
                          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{usage.type}</p>
                        <p className="text-sm text-gray-500">Added on {new Date(usage.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{usage.amount}</p>
                      <p className="text-sm text-gray-600">{usage.type === 'ELECTRICITY' ? 'kWh' : 'liters'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchased Carbon Credits Section */}
        {investmentsData && investmentsData.investments.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">My Carbon Credits Portfolio</h2>
              <p className="text-xl text-gray-600">Credits you've purchased to offset your carbon footprint</p>
            </div>

            {/* Portfolio Summary Cards */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">PURCHASED</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Credits</h3>
                <p className="text-3xl font-bold text-green-600 mb-1">{investmentsData.summary.totalCredits}</p>
                <p className="text-sm text-gray-600">Carbon credits owned</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">INVESTED</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Invested</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">${investmentsData.summary.totalInvested.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Amount invested</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl shadow-xl p-6 border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-200 px-2 py-1 rounded-full">PROJECTS</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Projects Supported</h3>
                <p className="text-3xl font-bold text-indigo-600 mb-1">{investmentsData.summary.totalInvestments}</p>
                <p className="text-sm text-gray-600">Environmental projects</p>
              </div>
            </div>

            {/* Net Impact Analysis */}
            {creditsData && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-xl p-8 mb-8 border border-emerald-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Carbon Footprint vs Credits Owned</h3>
                  <p className="text-gray-600">Your environmental impact analysis</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-md">
                    <p className="text-lg text-red-600 font-semibold mb-2">CO₂ Emissions</p>
                    <p className="text-3xl font-bold text-red-600">{creditsData.credits.totalTons.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Tons CO₂</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-md">
                    <p className="text-lg text-green-600 font-semibold mb-2">Credits Owned</p>
                    <p className="text-3xl font-bold text-green-600">{investmentsData.summary.totalCredits}</p>
                    <p className="text-sm text-gray-600">Carbon Credits</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-md">
                    <p className="text-lg text-gray-800 font-semibold mb-2">Net Impact</p>
                    <p className={`text-3xl font-bold ${
                      investmentsData.summary.totalCredits >= creditsData.credits.totalTons 
                        ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {investmentsData.summary.totalCredits >= creditsData.credits.totalTons 
                        ? '✓ Carbon Neutral' 
                        : `${(creditsData.credits.totalTons - investmentsData.summary.totalCredits).toFixed(1)} tons deficit`
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {investmentsData.summary.totalCredits >= creditsData.credits.totalTons 
                        ? 'Congratulations!' : 'Credits needed'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Investment History */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Investment History</h3>
              <div className="space-y-4">
                {investmentsData.investments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{investment.project.title}</h4>
                        <p className="text-sm text-gray-600">{investment.project.location}</p>
                        <p className="text-xs text-gray-500">
                          Purchased on {new Date(investment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{investment.creditsBought} credits</p>
                      <p className="text-sm text-gray-600">${investment.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link href="/projects">
                  <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                    Purchase More Credits
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* No Investments Message */}
        {investmentsData && investmentsData.investments.length === 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 text-center border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Carbon Neutral Journey</h3>
              <p className="text-gray-600 mb-6">
                You haven't purchased any carbon credits yet. Start offsetting your carbon footprint by investing in verified environmental projects.
              </p>
              <Link href="/projects">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                  Browse Carbon Credit Projects
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Environmental Impact Summary */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl shadow-2xl p-8 mb-12 text-white">
          <div className="text-center mb-8">
           
            <h2 className="text-3xl font-bold mb-2">Environmental Impact Summary</h2>
            <p className="text-xl text-white text-opacity-90">Your company's carbon footprint analysis</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <p className="text-lg text-black text-opacity-80 mb-2">Total Usage Records</p>
              <p className="text-4xl text-black font-bold">{summary.totalUsageRecords}</p>
              <p className="text-sm text-black text-opacity-70">Energy sources tracked</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <p className="text-lg text-black text-opacity-80 mb-2">Environmental Impact</p>
              <p className="text-4xl text-black font-bold">{summary.environmentalImpact}</p>
              <p className="text-sm text-black text-opacity-70">CO₂ equivalent emissions</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <p className="text-lg text-black text-opacity-80 mb-2">Total Offset Cost</p>
              <p className="text-4xl text-black font-bold">${summary.estimatedCost}</p>
              <p className="text-sm text-black text-opacity-70">Investment for net-zero</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="inline-flex gap-4">
            <Link href="/register">
              <button className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                ← Back to Dashboard
              </button>
            </Link>
            <Link href="/projects">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Explore Projects →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
