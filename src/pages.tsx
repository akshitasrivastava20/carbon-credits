"use client"

import { Leaf, TreePine, Globe, TrendingUp, Plus, Minus, ShieldCheck, CreditCard, Sparkles, Wallet, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "What are carbon credits and how do they work?",
      answer:
        "Carbon credits are tradeable certificates that represent the removal or reduction of one metric ton of CO2 from the atmosphere. When you purchase carbon credits, you're funding verified environmental projects that capture or prevent carbon emissions.",
    },
    {
      question: "How do I know the projects are legitimate?",
      answer:
        "All our carbon credit projects are verified by internationally recognized standards like Verra, Gold Standard, and CAR. Each project undergoes rigorous third-party auditing to ensure additionality, permanence, and measurable impact.",
    },
    {
      question: "Can I track my environmental impact?",
      answer:
        "Yes! Our platform provides detailed analytics showing your carbon offset progress, investment returns, and the specific environmental benefits of your chosen projects. You'll receive regular updates on project milestones and impact metrics.",
    },
    {
      question: "What types of projects can I invest in?",
      answer:
        "Our marketplace features diverse projects including reforestation, renewable energy, methane capture, direct air capture, and soil carbon sequestration. Each project is rated for impact, risk, and expected returns.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <Leaf className="w-5 h-5" />
            <span className="font-medium text-balance">Carbon Credits</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {["Projects", "About", "Impact", "FAQ", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">Start Investing</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6">
                <a href="/projects">Browse Projects</a>
              </Button>
            </SignedIn>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
          {/* Badge */}
          <div className="mb-6 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <span className="text-sm font-medium">Verified Carbon Projects</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 text-balance">Invest in Our Planet's Future</h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-12 leading-relaxed text-pretty">
            Purchase verified carbon credits, track your environmental impact, and invest in sustainable projects 
            that are fighting climate change while generating returns.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <SignedOut>
              <SignUpButton>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-lg">
                  Start Investing Today
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-4 text-lg">
                <a href="/projects">Browse Projects</a>
              </Button>
            </SignedIn>
            <Button
              size="lg"
              variant="outline"
              className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 rounded-full px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Footer Note */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Verified & Transparent</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Browse Projects */}
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse Projects</h3>
              <p className="text-white/80 leading-relaxed">Explore verified carbon credit projects from reforestation to renewable energy.</p>
            </div>

            {/* Invest Securely */}
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Invest Securely</h3>
              <p className="text-white/80 leading-relaxed">Purchase credits with secure payments and transparent pricing.</p>
            </div>

            {/* Track Impact */}
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Impact</h3>
              <p className="text-white/80 leading-relaxed">Monitor your environmental impact and investment performance in real-time.</p>
            </div>

            {/* Earn Returns */}
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/30 ring-1 ring-white/20 mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Returns</h3>
              <p className="text-white/80 leading-relaxed">Generate financial returns while making a positive environmental impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Investment Opportunities</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto text-pretty">
                Invest in diverse, high-impact environmental projects that are making a real difference.
              </p>
            </div>

            {/* Project Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Reforestation */}
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 ring-1 ring-white/20 mb-6">
                    <TreePine className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Reforestation</h3>
                  <p className="text-white/80 leading-relaxed text-sm mb-4">
                    Plant and protect trees in degraded ecosystems, creating carbon sinks while restoring biodiversity and supporting local communities.
                  </p>
                  <div className="text-sm text-white/60 font-medium">15-25 year projects • 8-12% expected returns</div>
                </div>
              </div>

              {/* Renewable Energy */}
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 ring-1 ring-white/20 mb-6">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Renewable Energy</h3>
                  <p className="text-white/80 leading-relaxed text-sm mb-4">
                    Support solar, wind, and hydroelectric projects that replace fossil fuel energy with clean alternatives in developing regions.
                  </p>
                  <div className="text-sm text-white/60 font-medium">10-20 year projects • 6-10% expected returns</div>
                </div>
              </div>

              {/* Direct Air Capture */}
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 h-80 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 ring-1 ring-white/20 mb-6">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Direct Air Capture</h3>
                  <p className="text-white/80 leading-relaxed text-sm mb-4">
                    Invest in cutting-edge technology that directly removes CO₂ from the atmosphere and stores it permanently underground.
                  </p>
                  <div className="text-sm text-white/60 font-medium">5-10 year projects • 10-15% expected returns</div>
                </div>
              </div>
            </div>

            {/* Check Availability Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-4 text-lg font-semibold"
              >
                <a href="/projects">Explore All Projects</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Title and Description */}
              <div>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-white/80 leading-relaxed text-pretty">
                  Everything you need to know about carbon credits, our verification process, and how to start investing in climate solutions.
                </p>
              </div>

              {/* Right Column - FAQ Accordion */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                      {openFaq === index ? (
                        <Minus className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-black/20 ring-1 ring-white/15 backdrop-blur p-12">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">Ready to Make an Impact?</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column - Contact Form */}
              <div className="rounded-2xl bg-white/95 text-black p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Start Your Investment Journey</h3>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your investment interests..."
                    />
                  </div>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg py-3 font-normal text-base">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Right Column - Contact Info */}
              <div className="space-y-8">
                <div>
                  <p className="text-xl text-white/90 leading-relaxed text-pretty">
                    Join thousands of investors who are making a difference while building their portfolio with verified carbon credits.
                  </p>
                </div>

                {/* Profile Card */}
                <div className="rounded-2xl bg-white/95 text-black p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                      alt="Sarah Chen"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">Sarah Chen</h4>
                      <p className="text-gray-600">Investment Advisor</p>
                    </div>
                  </div>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-lg flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl ring-1 ring-white/10 p-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Leaf className="w-6 h-6" />
                  <span className="text-xl font-semibold">Carbon Credits</span>
                </div>
                <p className="text-white/80 leading-relaxed text-pretty">
                  Your trusted platform for carbon credit investments. We are dedicated to transparency, verification, and environmental impact.
                </p>
              </div>

              {/* Investment Links */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6">INVESTING</h3>
                <ul className="space-y-3">
                  {["Projects", "Pricing", "Returns", "Portfolio"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/70 hover:text-white transition-colors text-sm leading-relaxed">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Links */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6">ABOUT</h3>
                <ul className="space-y-3">
                  {["Our Mission", "Verification", "Our Team", "Impact"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/70 hover:text-white transition-colors text-sm leading-relaxed">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6">RESOURCES</h3>
                <ul className="space-y-3">
                  {["Help Center", "Contact Us", "FAQ", "Terms & Conditions"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/70 hover:text-white transition-colors text-sm leading-relaxed">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-t border-white/10 pt-12 mb-12">
              <div className="max-w-md">
                <h3 className="text-lg font-semibold mb-4">Get Investment Updates</h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 ring-1 ring-white/20 backdrop-blur border-0 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 focus:outline-none"
                  />
                  <Button className="bg-white text-black hover:bg-white/90 rounded-lg px-6 h-[50px]">Subscribe</Button>
                </div>
              </div>
            </div>

            {/* Sub-footer */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/60 text-sm text-center">© 2025 Carbon Credits Platform</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
