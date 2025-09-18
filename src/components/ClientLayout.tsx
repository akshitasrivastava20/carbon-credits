"use client";

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 bg-repeat z-0 pointer-events-none"
        style={{ 
          backgroundImage: "url('/chatgpt-background.png')",
          backgroundSize: '120px 120px',
        }}
      ></div>
      
      {/* Auth Section */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <button className="bg-white hover:bg-gray-50 text-green-600 border border-green-600 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 pointer-events-auto">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
