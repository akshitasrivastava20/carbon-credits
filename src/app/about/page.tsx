import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            About <span className="text-green-600">Carbon Credits</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive platform for carbon footprint tracking, credit management, 
            and sustainable investment opportunities in verified environmental projects.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Documentation Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <a href="#overview" className="block text-green-600 hover:text-green-700 transition-colors">1. Platform Overview</a>
              <a href="#carbon-credits" className="block text-green-600 hover:text-green-700 transition-colors">2. Understanding Carbon Credits</a>
              <a href="#features" className="block text-green-600 hover:text-green-700 transition-colors">3. Platform Features</a>
              <a href="#functionality" className="block text-green-600 hover:text-green-700 transition-colors">4. Core Functionality</a>
            </div>
            <div className="space-y-2">
              <a href="#why-invest" className="block text-green-600 hover:text-green-700 transition-colors">5. Why Invest in Carbon Credits</a>
              <a href="#benefits" className="block text-green-600 hover:text-green-700 transition-colors">6. Business Benefits</a>
              <a href="#technology" className="block text-green-600 hover:text-green-700 transition-colors">7. Technology Stack</a>
              <a href="#getting-started" className="block text-green-600 hover:text-green-700 transition-colors">8. Getting Started</a>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <section id="overview" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-green-100 rounded-full p-3 mr-4">🌍</span>
              Platform Overview
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                Our Carbon Credits platform is a comprehensive digital solution designed to bridge the gap between 
                environmental responsibility and business operations. We provide companies with the tools to measure, 
                track, and offset their carbon footprint while facilitating investment in verified environmental projects.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-3">🎯 Mission</h3>
                  <p>Democratize access to carbon markets and make sustainability actionable for businesses of all sizes.</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-3">👁️ Vision</h3>
                  <p>A world where every business contributes to climate action through transparent, verified carbon investments.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-3">⚡ Purpose</h3>
                  <p>Simplify carbon management and accelerate the transition to a net-zero economy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Carbon Credits */}
        <section id="carbon-credits" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 rounded-full p-3 mr-4">🌱</span>
              Understanding Carbon Credits
            </h2>
            
            <div className="space-y-8">
              {/* What are Carbon Credits */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">What are Carbon Credits?</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Carbon credits are tradeable certificates that represent the reduction, avoidance, or removal of one metric ton 
                  of carbon dioxide equivalent (CO2e) from the atmosphere. They serve as a market-based mechanism to incentivize 
                  emissions reductions and fund climate action projects worldwide.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Key Principles:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>✅ <strong>Additionality:</strong> Projects must prove emissions reductions wouldn't have occurred otherwise</li>
                    <li>✅ <strong>Measurability:</strong> Reductions must be quantifiable using verified methodologies</li>
                    <li>✅ <strong>Permanence:</strong> Reductions should be long-lasting and not easily reversible</li>
                    <li>✅ <strong>Verification:</strong> Third-party validation ensures project integrity</li>
                  </ul>
                </div>
              </div>

              {/* Why Carbon Credits Matter */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Carbon Credits Matter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-700">Environmental Impact</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Fund renewable energy projects</li>
                      <li>• Support reforestation initiatives</li>
                      <li>• Enable methane capture projects</li>
                      <li>• Accelerate clean technology adoption</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-700">Business Value</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Meet regulatory compliance requirements</li>
                      <li>• Achieve net-zero commitments</li>
                      <li>• Enhance brand reputation</li>
                      <li>• Attract ESG-focused investors</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The Need for Carbon Credits */}
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-2xl font-semibold text-red-800 mb-4">The Urgent Need for Carbon Action</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-red-600">1.5°C</div>
                    <p className="text-sm text-red-700">Global warming limit to avoid catastrophic climate change</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600">45%</div>
                    <p className="text-sm text-red-700">Emissions reduction needed by 2030 (vs 2010 levels)</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600">$131T</div>
                    <p className="text-sm text-red-700">Investment needed for net-zero by 2050</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section id="features" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-purple-100 rounded-full p-3 mr-4">⚡</span>
              Platform Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Carbon Footprint Calculator */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-3">Carbon Footprint Calculator</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Electricity usage tracking</li>
                  <li>• Fuel consumption analysis</li>
                  <li>• Industry-specific calculations</li>
                  <li>• Real-time emissions data</li>
                </ul>
              </div>

              {/* Project Marketplace */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🏪</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">Project Marketplace</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Verified carbon projects</li>
                  <li>• Direct investment options</li>
                  <li>• Project impact tracking</li>
                  <li>• Transparent pricing</li>
                </ul>
              </div>

              {/* Credits Portfolio */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">💼</span>
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3">Credits Portfolio</h3>
                <ul className="space-y-2 text-purple-700">
                  <li>• Investment tracking</li>
                  <li>• Carbon neutral status</li>
                  <li>• Certificate generation</li>
                  <li>• Impact reporting</li>
                </ul>
              </div>

              {/* Company Registration */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="bg-orange-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🏢</span>
                </div>
                <h3 className="text-xl font-bold text-orange-800 mb-3">Company Management</h3>
                <ul className="space-y-2 text-orange-700">
                  <li>• Easy registration process</li>
                  <li>• Profile management</li>
                  <li>• Industry categorization</li>
                  <li>• Compliance tracking</li>
                </ul>
              </div>

              {/* Payment Integration */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
                <div className="bg-teal-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">💳</span>
                </div>
                <h3 className="text-xl font-bold text-teal-800 mb-3">Secure Payments</h3>
                <ul className="space-y-2 text-teal-700">
                  <li>• Dodo payment integration</li>
                  <li>• Test mode support</li>
                  <li>• Transaction tracking</li>
                  <li>• Payment history</li>
                </ul>
              </div>

              {/* Analytics Dashboard */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-white text-xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-3">Analytics & Reporting</h3>
                <ul className="space-y-2 text-indigo-700">
                  <li>• Emissions trends</li>
                  <li>• Investment ROI</li>
                  <li>• Impact visualization</li>
                  <li>• Custom reports</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Functionality */}
        <section id="functionality" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-orange-100 rounded-full p-3 mr-4">⚙️</span>
              Core Functionality
            </h2>
            
            <div className="space-y-8">
              {/* User Journey */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Complete User Journey</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-300"></div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 relative z-10">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Company Registration</h4>
                        <p className="text-gray-600">Sign up, verify your company details, and set up your sustainability profile.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 relative z-10">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Carbon Footprint Assessment</h4>
                        <p className="text-gray-600">Input your energy usage data to calculate your current carbon emissions.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 relative z-10">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Project Discovery</h4>
                        <p className="text-gray-600">Browse verified carbon offset projects and choose investments that align with your values.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 relative z-10">4</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Investment & Tracking</h4>
                        <p className="text-gray-600">Make secure investments and track your carbon neutral progress in real-time.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm mr-4 relative z-10">5</div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Impact Reporting</h4>
                        <p className="text-gray-600">Generate certificates and reports to showcase your environmental contributions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Capabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Capabilities</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✅ Real-time emissions calculations</li>
                    <li>✅ Secure payment processing</li>
                    <li>✅ Automated certificate generation</li>
                    <li>✅ Database-driven project verification</li>
                    <li>✅ Responsive web design</li>
                    <li>✅ User authentication & authorization</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>📊 Company profile management</li>
                    <li>📊 Energy usage tracking</li>
                    <li>📊 Investment history</li>
                    <li>📊 Project impact metrics</li>
                    <li>📊 Transaction records</li>
                    <li>📊 Carbon footprint analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Invest */}
        <section id="why-invest" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-green-100 rounded-full p-3 mr-4">💰</span>
              Why Invest in Carbon Credits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financial Benefits */}
              <div>
                <h3 className="text-2xl font-semibold text-green-700 mb-4">Financial Benefits</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Tax Incentives</h4>
                    <p className="text-green-700">Many jurisdictions offer tax deductions for verified carbon offset investments.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Future Value</h4>
                    <p className="text-green-700">Carbon prices are expected to rise as regulations tighten and demand increases.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Risk Mitigation</h4>
                    <p className="text-green-700">Protect against future carbon pricing and regulatory compliance costs.</p>
                  </div>
                </div>
              </div>

              {/* Strategic Benefits */}
              <div>
                <h3 className="text-2xl font-semibold text-blue-700 mb-4">Strategic Benefits</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Brand Differentiation</h4>
                    <p className="text-blue-700">Stand out in the market as an environmentally responsible company.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Customer Loyalty</h4>
                    <p className="text-blue-700">90% of consumers prefer environmentally conscious brands.</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Investor Appeal</h4>
                    <p className="text-blue-700">ESG investments now represent over $30 trillion globally.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Opportunity */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Market Opportunity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">$1B+</div>
                  <p className="text-sm">Voluntary carbon market size in 2023</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">15x</div>
                  <p className="text-sm">Expected growth by 2030</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">5,000+</div>
                  <p className="text-sm">Companies with net-zero commitments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Benefits */}
        <section id="benefits" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 rounded-full p-3 mr-4">🏆</span>
              Business Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-green-800 mb-3">Regulatory Compliance</h3>
                <p className="text-green-700">Stay ahead of evolving carbon regulations and mandatory reporting requirements.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">Market Leadership</h3>
                <p className="text-blue-700">Position your company as an industry leader in sustainability and innovation.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-purple-800 mb-3">Stakeholder Trust</h3>
                <p className="text-purple-700">Build trust with investors, customers, and employees through transparent climate action.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-orange-800 mb-3">Operational Efficiency</h3>
                <p className="text-orange-700">Identify energy waste and optimize operations through detailed carbon tracking.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-teal-800 mb-3">Employee Engagement</h3>
                <p className="text-teal-700">Boost employee morale and retention through meaningful environmental initiatives.</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                <div className="text-4xl mb-4">🔮</div>
                <h3 className="text-xl font-bold text-indigo-800 mb-3">Future-Proofing</h3>
                <p className="text-indigo-700">Prepare your business for a carbon-constrained economy and changing consumer expectations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section id="technology" className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-indigo-100 rounded-full p-3 mr-4">💻</span>
              Technology Stack
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Frontend Technologies</h3>
                <div className="space-y-3">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium mr-3">Next.js 15</span>
                    <span className="text-gray-700">React framework with server-side rendering</span>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="bg-cyan-600 text-white px-3 py-1 rounded text-sm font-medium mr-3">TailwindCSS</span>
                    <span className="text-gray-700">Utility-first CSS framework</span>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium mr-3">Framer Motion</span>
                    <span className="text-gray-700">Animation library for smooth interactions</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Backend & Database</h3>
                <div className="space-y-3">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium mr-3">Prisma ORM</span>
                    <span className="text-gray-700">Type-safe database access</span>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="bg-blue-800 text-white px-3 py-1 rounded text-sm font-medium mr-3">PostgreSQL</span>
                    <span className="text-gray-700">Robust relational database</span>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded text-sm font-medium mr-3">Clerk Auth</span>
                    <span className="text-gray-700">Modern authentication solution</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
                  <h4 className="font-bold text-orange-800 mb-2">Dodo Payments</h4>
                  <p className="text-orange-700 text-sm">Secure payment processing for carbon credit investments</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">Carbon Calculators</h4>
                  <p className="text-green-700 text-sm">Industry-standard emissions calculation algorithms</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">Project APIs</h4>
                  <p className="text-blue-700 text-sm">Direct integration with verified project registries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="mb-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="bg-white/20 rounded-full p-3 mr-4">🚀</span>
              Getting Started
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Ready to Begin Your Climate Journey?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Join thousands of companies already making a difference through verified carbon investments.
                </p>
                
                <div className="space-y-4">
                  <SignedOut>
                    <SignInButton>
                      <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Start Your Registration
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/register">
                      <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Go to Dashboard
                      </button>
                    </Link>
                  </SignedIn>
                  
                  <div className="flex space-x-4">
                    <Link href="/projects" className="text-white hover:text-gray-200 underline">
                      Browse Projects
                    </Link>
                    <Link href="/credits" className="text-white hover:text-gray-200 underline">
                      View Credits
                    </Link>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>⏱️ Setup Time:</strong> Less than 5 minutes to register and start calculating your footprint
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>💰 Minimum Investment:</strong> Start offsetting with investments as low as $10
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>📊 Real-time Tracking:</strong> Monitor your carbon neutral progress instantly
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <strong>🏆 Verified Projects:</strong> All projects are third-party verified and certified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Support */}
        <section className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our team is here to support your sustainability journey every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <a
  href="mailto:yourgmail@gmail.com?subject=Support%20Request&body=Hi%20Team,%0D%0A%0D%0AI%20need%20help%20with..."
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  Contact Support
</a>

              <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
