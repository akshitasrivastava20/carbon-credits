'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function InvestmentCancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Investment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your investment was cancelled. No charges were made to your account. You can try again anytime or explore other carbon credit projects.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/projects')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Explore Projects
          </button>
          
          <button 
            onClick={() => router.back()}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Need help? Contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
