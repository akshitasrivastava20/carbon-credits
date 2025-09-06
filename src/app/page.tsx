
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

import Globe from '@/components/ui/globe'
import { BlurFade } from '@/components/ui/blur-fade';
import { ThreeDCardDemo } from '@/components/cardComponent';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation with Sign In button in top right */}
        <nav className="flex justify-between items-center p-6 bg-transparent">
          <div className="text-2xl font-bold text-green-800 drop-shadow-lg">
            Carbon Credits
          </div>
          <div>
            <SignedOut>
              <SignInButton>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/register" className="text-white hover:text-green-300 transition-colors">
                  Dashboard
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </nav>

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
        
       
        
        {/* 3D Card Demo Section */}
        <ThreeDCardDemo />
        
       
      </div>
    </div>
  );
}
