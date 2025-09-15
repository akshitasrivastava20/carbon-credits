"use client";

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Home as HomeIcon, Info, CreditCard, Building2, Leaf } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Home", url: "/", icon: HomeIcon },
    { name: "About", url: "/about", icon: Info },
    { name: "Projects", url: "/projects", icon: Leaf },
    { name: "Credits", url: "/credits", icon: CreditCard },
    { name: "Register", url: "/register", icon: Building2 },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 bg-repeat z-0"
        style={{ 
          backgroundImage: "url('/chatgpt-background.png')",
          backgroundSize: '120px 120px',
        }}
      ></div>
      
      {/* TubeLight Navbar - Available on all pages */}
      <NavBar items={navItems} />
      
      {/* Auth Section - Available on all pages */}
      <div className="fixed top-6 right-6 z-50">
        <SignedOut>
          <div className="flex items-center gap-3">
            <SignInButton fallbackRedirectUrl="/register">
              <button className="bg-white hover:bg-gray-50 text-green-600 border border-green-600 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton fallbackRedirectUrl="/register">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </SignedIn>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
