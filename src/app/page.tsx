
import Link from 'next/link'

import Globe from '@/components/ui/globe'
import { BlurFade } from '@/components/ui/blur-fade';
import { ThreeDCardDemo } from '@/components/cardComponent';
import TypewriterEffectSection from '@/components/TypewriterEffectSection';
import { Button } from '@/components/ui/moving-border';
import { Footer } from '@/components/ui/large-name-footer';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="relative min-h-screen">
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
 Shape a Sustainable Tomorrow.”</span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.5} inView>
            <SignedOut>
              <SignUpButton>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                  Get Started Today
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link 
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg cursor-pointer inline-block"
                style={{ pointerEvents: 'auto' }}
              >
                Dashboard
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
