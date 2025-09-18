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
          
          <div className="mt-8">
            <SignedOut>
              <Link href="/sign-up" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block">
                Get Started Today
              </Link>
            </SignedOut>

            <SignedIn>
              <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
        
        {/* Globe Section */}
        <div className="flex justify-center py-10">
          <Globe />
        </div>
          
        {/* Typewriter Effect Section */}
        <TypewriterEffectSection />
        
        {/* Credits Button Section */}
        <div className="flex justify-center py-10">
          <Link href="/credits" className="bg-white hover:bg-gray-50 text-black border-2 border-gray-300 hover:border-gray-400 px-8 py-4 rounded-3xl text-lg font-semibold transition-colors shadow-lg inline-block">
            Your Credits
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
