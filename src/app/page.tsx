import Globe from '@/components/ui/globe'
import { BlurFade } from '@/components/ui/blur-fade';
import { ThreeDCardDemo } from '@/components/cardComponent';
import TypewriterEffectSection from '@/components/TypewriterEffectSection';
import { Footer } from '@/components/ui/large-name-footer';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import CustomButton from '@/components/CustomButton';

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
              <BlurFade delay={0.5} inView>
                <CustomButton href="/sign-up">
                  Get Started Today
                </CustomButton>
              </BlurFade>
            </SignedOut>

            <SignedIn>
              <BlurFade delay={0.5} inView>
                <CustomButton href="/register">
                  Dashboard
                </CustomButton>
              </BlurFade>
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
        <BlurFade delay={0.3} inView>
          <div className="flex justify-center py-10">
            <CustomButton href="/credits" variant="secondary" className="rounded-3xl">
              Your Credits
            </CustomButton>
          </div>
        </BlurFade>
        
        {/* 3D Card Demo Section */}
        <ThreeDCardDemo />
        
        {/* Footer Section */}
        <Footer />
       
      </div>
    </div>
  );
}
