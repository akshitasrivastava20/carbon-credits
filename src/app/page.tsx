"use client";

import Link from 'next/link';
import Globe from '@/components/ui/globe'
import { BlurFade } from '@/components/ui/blur-fade';
import { ThreeDCardDemo } from '@/components/cardComponent';
import TypewriterEffectSection from '@/components/TypewriterEffectSection';
import { Footer } from '@/components/ui/large-name-footer';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Dashboard Button - Left side to avoid Clerk profile button */}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 99999,
          isolation: 'isolate'
        }}
        dangerouslySetInnerHTML={{
          __html: `
            <button 
              onclick="console.log('Dashboard clicked!'); window.location.href='/register';"
              onmouseover="this.style.backgroundColor='#047857';"
              onmouseout="this.style.backgroundColor='#059669';"
              style="
                background-color: #059669;
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                pointer-events: auto;
                z-index: 99999;
                position: relative;
                isolation: isolate;
                display: block;
                transition: background-color 0.2s ease;
              "
            >
              Dashboard
            </button>
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10">

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Your sustainability, simplified  
              <br />
              <span className="text-green-800">
Track. Offset. Invest.<br/>
 Shape a Sustainable Tomorrow."</span>
            </h1>
          </BlurFade>
          
          <div className="mt-8 space-y-4">
            <SignedOut>
              <Link href="/sign-up" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block">
                Get Started Today
              </Link>
            </SignedOut>
          </div>
        </div>
        
        {/* Globe Section */}
        <div className="flex justify-center py-10">
          <Globe />
        </div>
          
        {/* Typewriter Effect Section */}
        <TypewriterEffectSection />
        

        
        {/* 3D Card Demo Section */}
        <ThreeDCardDemo />
        
        {/* Footer Section */}
        <Footer />
       
      </div>
    </div>
  );
}
