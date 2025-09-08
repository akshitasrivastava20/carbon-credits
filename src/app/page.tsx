
"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Home as HomeIcon, Info, CreditCard, Building2, Leaf } from 'lucide-react'

import Globe from '@/components/ui/globe'
import { BlurFade } from '@/components/ui/blur-fade';
import { ThreeDCardDemo } from '@/components/cardComponent';
import TypewriterEffectSection from '@/components/TypewriterEffectSection';
import { Button } from '@/components/ui/moving-border';
import { Footer } from '@/components/ui/large-name-footer';
import { NavBar } from '@/components/ui/tubelight-navbar';

export default function Home() {
  const navItems = [
    { name: "Home", url: "/", icon: HomeIcon },
    { name: "About", url: "/about", icon: Info },
    { name: "Projects", url: "/projects", icon: Leaf },
    { name: "Credits", url: "/credits", icon: CreditCard },
    { name: "Register", url: "/register", icon: Building2 },
  ];

  return (
    <div className="relative min-h-screen">
      {/* TubeLight Navbar */}
      <NavBar items={navItems} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Auth Section - moved to top right corner */}
        <div className="absolute top-6 right-6 z-50">
          <SignedOut>
            <SignInButton>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Your sustainability, simplified  
              <br />
              <span className="text-green-800">
Track. Offset. Invest.<br/>
 Shape a Sustainable Tomorrow.”</span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <SignedOut>
              <SignInButton>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                  Get Started Today
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/register">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                 dashboard
                </button>
              </Link>
            </SignedIn>
          </BlurFade>
        </div>
        
        {/* Globe Section */}
        <div className="flex justify-center py-10">
          <Globe />
        </div>
          
        {/* Typewriter Effect Section */}
        <TypewriterEffectSection />
        
        {/* Moving Border Button Section */}
        <div className="flex justify-center py-10">
          <Link href="/credits">
            <Button
              borderRadius="1.75rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              your credits
            </Button>
          </Link>
        </div>
        
        
        {/* 3D Card Demo Section */}
        <ThreeDCardDemo />
        
        {/* Footer Section */}
        <Footer />
       
      </div>
    </div>
  );
}
