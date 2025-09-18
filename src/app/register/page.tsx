"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: "",
    address: "",
    taxId: "",
    electricityKWh: "",
    fuelUsage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  // Update form email when user data is available
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setForm(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  // Check registration status
  useEffect(() => {
    if (user?.id) {
      setIsCheckingRegistration(false);
    }
  }, [user?.id]);

  // Handle the specific overlapping element that was blocking form interactions
  useEffect(() => {
    const handleOverlappingElements = () => {
      // Hide the exact overlapping element that was identified in DevTools
      const overlappingElement = document.querySelector('.fixed.bottom-0.sm\\:top-0.left-1\\/2.-translate-x-1\\/2.z-50.mb-6.sm\\:pt-6');
      if (overlappingElement) {
        (overlappingElement as HTMLElement).style.display = 'none';
        console.log('Overlapping element hidden successfully');
      }

      // Also check for similar problematic elements
      const similarElements = document.querySelectorAll('.fixed.bottom-0, .fixed[class*="bottom-0"]');
      similarElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const classList = htmlElement.className;
        
        // Hide elements that match the problematic pattern
        if (classList.includes('fixed') && 
            classList.includes('bottom-0') && 
            classList.includes('z-50')) {
          htmlElement.style.display = 'none';
          console.log('Similar overlapping element hidden');
        }
      });
    };

    // Run immediately and also after a short delay to catch dynamically loaded elements
    handleOverlappingElements();
    const timer = setTimeout(handleOverlappingElements, 500);
    
    // Clean up
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email) {
      alert('Please fill in required fields: Company Name and Email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('Company registered successfully!');
        router.push('/projects');
      } else {
        alert('Registration failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (isCheckingRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking registration status...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6" 
      style={{ 
        position: 'relative', 
        zIndex: 99999,
        isolation: 'isolate' 
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-gray-100" style={{ position: 'relative', zIndex: 10000 }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Registration</h1>
          <p className="text-gray-600">Join our carbon credits platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6" style={{ position: 'relative', zIndex: 10001 }}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input 
              type="text"
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
              placeholder="Enter your company name"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Industry Type
            </label>
            <input 
              type="text"
              name="industry" 
              value={form.industry} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
              placeholder="e.g., Manufacturing, Technology, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
              placeholder="Enter your email address"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Address
            </label>
            <input 
              type="text"
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
              placeholder="Enter your company address (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tax ID/PAN/GST
            </label>
            <input 
              type="text"
              name="taxId" 
              value={form.taxId} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
              placeholder="Enter your tax ID (optional)"
            />
          </div>

          {/* Energy Usage Section for Carbon Credit Calculations */}
          <div className="border-t-2 border-gray-100 pt-6 mt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">⚡ Energy Usage Information</h3>
              <p className="text-sm text-gray-600">Help us calculate your carbon footprint and potential credits</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Electricity Usage (kWh)
                </label>
                <input 
                  type="number"
                  name="electricityKWh" 
                  value={form.electricityKWh} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
                  placeholder="e.g., 50000 kWh per year"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">💡 Check your electricity bills for annual consumption</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Diesel/Fuel Usage (Liters)
                </label>
                <input 
                  type="number"
                  name="fuelUsage" 
                  value={form.fuelUsage} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-800 bg-white placeholder-gray-400"
                  placeholder="e.g., 5000 liters per year"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">⛽ Include generators, vehicles, and machinery fuel consumption</p>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Registering Your Company...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Register Company
              </span>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600">
            Already registered? 
            <button 
              type="button"
              onClick={() => router.push('/projects')}
              className="ml-2 text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
            >
              View Projects →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
