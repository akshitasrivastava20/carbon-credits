"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function RegisterPage() {
  const { user } = useUser();
  const router = useRouter();
  console.log(user?.id); // This is the clerkUserId

  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    address: "",
    certificateUrl: "",
    taxId: "",
    electricityKWh: "",
    fuelUsage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [creditsData, setCreditsData] = useState<any>(null);
  const [isCalculatingCredits, setIsCalculatingCredits] = useState(false);

  // Update form email when user data is available
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setForm(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || ""
      }));
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  // Check if company is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch("/api/credits/me");
        const data = await response.json();
        
        if (data.success && data.company) {
          setIsRegistered(true);
          setCompanyData(data.company);
          // Populate form with existing data for editing
          const electricityUsage = data.usages?.find((u: any) => u.type === 'ELECTRICITY');
          const fuelUsage = data.usages?.find((u: any) => u.type === 'DIESEL');
          
          setForm({
            name: data.company.name || "",
            industry: data.company.industry || "",
            email: data.company.email || "",
            address: data.company.address || "",
            certificateUrl: data.company.certificateUrl || "",
            taxId: data.company.taxId || "",
            electricityKWh: electricityUsage?.amount?.toString() || "",
            fuelUsage: fuelUsage?.amount?.toString() || "",
          });
        } else if (data.needsRegistration) {
          setIsRegistered(false);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    if (user?.id) {
      checkRegistration();
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Determine if we're updating or creating
      const url = "/api/register";
      const method = isEditMode ? "PUT" : "POST";
      
      // Send form data - user ID will be extracted from auth token on backend
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (isEditMode) {
          alert("Profile updated successfully!");
          // Update company data and exit edit mode
          setCompanyData(data.company);
          setIsEditMode(false);
        } else {
          alert("Company registered successfully!");
          // Redirect to projects page after successful registration
          router.push("/project");
        }
      } else {
        if (res.status === 503) {
          alert("Database is temporarily unavailable. Please try again in a moment.");
        } else {
          alert(`${isEditMode ? "Update" : "Registration"} failed: ` + (data.error || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculateCredits = () => {
    router.push("/credits");
  };



  return (
    <div className="min-h-screen pt-20 px-6 flex items-center justify-center relative z-20" style={{ pointerEvents: 'auto' }}>
      <div className="max-w-lg w-full p-8 shadow-2xl rounded-2xl bg-white bg-opacity-95 backdrop-blur-sm border border-white border-opacity-30 relative z-30" style={{ pointerEvents: 'auto' }}>
        
        {!user ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user information...</p>
          </div>
        ) : isCheckingRegistration ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking registration status...</p>
          </div>
        ) : (isRegistered && !isEditMode) ? (
          // Company is already registered - show dashboard options
          <div className="text-center space-y-6">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Welcome Back!</h1>
              <p className="text-gray-600 mb-2 text-lg">
                <span className="font-semibold text-green-600">{companyData?.name}</span>
              </p>
              <p className="text-sm text-gray-500">Your company is registered and ready to go.</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link href="/projects" className="block w-full">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  🌱 Explore Projects
                </button>
              </Link>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  ✏️ Edit Profile
                </button>
                
                <button 
                  onClick={handleCalculateCredits}
                  disabled={isCalculatingCredits}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isCalculatingCredits ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2z" />
                      </svg>
                      Calculate Credits
                    </>
                  )}
                </button>
              </div>
            </div>
              
            {/* Company Details Card */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Company Details</h3>
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Industry</p>
                    <p className="text-gray-800 font-semibold">{companyData?.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-gray-800 font-semibold break-all">{companyData?.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      companyData?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      companyData?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {companyData?.status || 'active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Show registration form or edit form
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditMode ? "Edit Profile" : "Company Registration"}
              </h1>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Back
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                name="name" 
                placeholder="Company Name" 
                value={form.name} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                required 
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  isolation: 'isolate',
                  background: 'white !important'
                }}
              />
              
              <input 
                name="industry" 
                placeholder="Industry Type" 
                value={form.industry} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  isolation: 'isolate',
                  background: 'white !important'
                }}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={form.email} 
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                  required 
                  style={{ 
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 50,
                    isolation: 'isolate',
                    background: 'white !important'
                  }}
                />
              </div>
              
              <input 
                name="address" 
                placeholder="Company Address (Optional)" 
                value={form.address} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  isolation: 'isolate',
                  background: 'white !important'
                }}
              />

              <input 
                name="certificateUrl" 
                placeholder="Certificate File URL (Optional)" 
                value={form.certificateUrl} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  isolation: 'isolate',
                  background: 'white !important'
                }}
              />
              
              <input 
                name="taxId" 
                placeholder="Tax ID/PAN/GST (Optional)" 
                value={form.taxId} 
                onChange={handleChange} 
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  isolation: 'isolate',
                  background: 'white !important'
                }}
              />
              
              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Energy Usage Information</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">Help us calculate your carbon footprint (Optional)</p>
                
                <div className="space-y-4">
                  <input 
                    name="electricityKWh" 
                    placeholder="Annual Electricity Usage (kWh)" 
                    value={form.electricityKWh} 
                    onChange={handleChange} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    style={{ 
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 50,
                      isolation: 'isolate',
                      background: 'white !important'
                    }}
                  />
                  
                  <input 
                    name="fuelUsage" 
                    placeholder="Annual Diesel/Fuel Usage (Liters)" 
                    value={form.fuelUsage} 
                    onChange={handleChange} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors placeholder-gray-500 text-gray-800" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    style={{ 
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 50,
                      isolation: 'isolate',
                      background: 'white !important'
                    }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg mt-6"
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  isolation: 'isolate'
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isEditMode ? "Updating..." : "Registering..."}
                  </span>
                ) : (
                  isEditMode ? "Update Profile" : "Register Company"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
