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
    <div className="min-h-screen pt-20 px-6 flex items-center justify-center relative z-20">
      {/* Working Registration Form */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          isolation: 'isolate'
        }}
        dangerouslySetInnerHTML={{
          __html: `
            <div style="
              background: white; 
              padding: 30px; 
              border-radius: 12px; 
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              max-width: 450px;
              width: 90vw;
              max-height: 85vh;
              overflow-y: auto;
            ">
              <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; color: #1f2937;">
                ${isEditMode ? "Edit Profile" : "Company Registration"}
              </h2>
              
              <input 
                id="companyName"
                placeholder="Company Name *" 
                style="
                  width: 100%; 
                  padding: 12px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  margin-bottom: 15px;
                  display: block;
                  box-sizing: border-box;
                  background: white;
                  color: #1f2937;
                "
                onfocus="this.style.border='2px solid #059669';"
                onblur="this.style.border='2px solid #d1d5db';"
                oninput="
                  window.registrationData = window.registrationData || {};
                  window.registrationData.name = this.value;
                  console.log('Company name:', this.value);
                "
              />
              
              <input 
                id="industry"
                placeholder="Industry Type" 
                style="
                  width: 100%; 
                  padding: 12px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  margin-bottom: 15px;
                  display: block;
                  box-sizing: border-box;
                  background: white;
                  color: #1f2937;
                "
                onfocus="this.style.border='2px solid #059669';"
                onblur="this.style.border='2px solid #d1d5db';"
                oninput="
                  window.registrationData = window.registrationData || {};
                  window.registrationData.industry = this.value;
                "
              />
              
              <input 
                id="email"
                type="email"
                placeholder="Email Address *" 
                value="${form.email.replace(/"/g, '&quot;')}"
                style="
                  width: 100%; 
                  padding: 12px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  margin-bottom: 15px;
                  display: block;
                  box-sizing: border-box;
                  background: white;
                  color: #1f2937;
                "
                onfocus="this.style.border='2px solid #059669';"
                onblur="this.style.border='2px solid #d1d5db';"
                oninput="
                  window.registrationData = window.registrationData || {};
                  window.registrationData.email = this.value;
                "
              />
              
              <input 
                id="address"
                placeholder="Company Address (Optional)" 
                style="
                  width: 100%; 
                  padding: 12px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  margin-bottom: 15px;
                  display: block;
                  box-sizing: border-box;
                  background: white;
                  color: #1f2937;
                "
                onfocus="this.style.border='2px solid #059669';"
                onblur="this.style.border='2px solid #d1d5db';"
                oninput="
                  window.registrationData = window.registrationData || {};
                  window.registrationData.address = this.value;
                "
              />
              
              <input 
                id="taxId"
                placeholder="Tax ID/PAN/GST (Optional)" 
                style="
                  width: 100%; 
                  padding: 12px; 
                  border: 2px solid #d1d5db; 
                  border-radius: 8px; 
                  font-size: 16px;
                  margin-bottom: 20px;
                  display: block;
                  box-sizing: border-box;
                  background: white;
                  color: #1f2937;
                "
                onfocus="this.style.border='2px solid #059669';"
                onblur="this.style.border='2px solid #d1d5db';"
                oninput="
                  window.registrationData = window.registrationData || {};
                  window.registrationData.taxId = this.value;
                "
              />
              
              <button 
                onclick="
                  // Disable button and show loading
                  this.disabled = true;
                  this.innerHTML = 'Registering...';
                  this.style.opacity = '0.6';
                  this.style.cursor = 'not-allowed';
                  
                  window.registrationData = window.registrationData || {};
                  
                  // Get current values from inputs
                  window.registrationData.name = document.getElementById('companyName').value;
                  window.registrationData.industry = document.getElementById('industry').value;
                  window.registrationData.email = document.getElementById('email').value;
                  window.registrationData.address = document.getElementById('address').value;
                  window.registrationData.taxId = document.getElementById('taxId').value;
                  
                  console.log('Registration data:', window.registrationData);
                  
                  if (!window.registrationData.name || !window.registrationData.email) {
                    alert('Please fill in required fields: Company Name and Email');
                    // Re-enable button
                    this.disabled = false;
                    this.innerHTML = '${isEditMode ? "Update Profile" : "Register Company"}';
                    this.style.opacity = '1';
                    this.style.cursor = 'pointer';
                    return;
                  }
                  
                  // Basic email validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(window.registrationData.email)) {
                    alert('Please enter a valid email address');
                    // Re-enable button
                    this.disabled = false;
                    this.innerHTML = '${isEditMode ? "Update Profile" : "Register Company"}';
                    this.style.opacity = '1';
                    this.style.cursor = 'pointer';
                    return;
                  }
                  
                  // Submit to backend API
                  fetch('/api/register', {
                    method: '${isEditMode ? "PUT" : "POST"}',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(window.registrationData)
                  })
                  .then(response => response.json())
                  .then(data => {
                    console.log('API Response:', data);
                    if (data.success) {
                      alert('${isEditMode ? "Profile updated successfully!" : "Company registered successfully!"}');
                      // Redirect to projects page
                      window.location.href = '/projects';
                    } else {
                      alert('${isEditMode ? "Update" : "Registration"} failed: ' + (data.error || 'Unknown error'));
                    }
                  })
                  .catch(error => {
                    console.error('Submit error:', error);
                    alert('Network error. Please check your connection and try again.');
                  })
                  .finally(() => {
                    // Re-enable button
                    this.disabled = false;
                    this.innerHTML = '${isEditMode ? "Update Profile" : "Register Company"}';
                    this.style.opacity = '1';
                    this.style.cursor = 'pointer';
                  });
                " 
                style="
                  width: 100%; 
                  background-color: #059669; 
                  color: white; 
                  border: none; 
                  padding: 14px; 
                  border-radius: 8px; 
                  font-size: 18px; 
                  font-weight: 600; 
                  cursor: pointer;
                  transition: background-color 0.2s ease;
                "
                onmouseover="this.style.backgroundColor='#047857';"
                onmouseout="this.style.backgroundColor='#059669';"
              >
                ${isEditMode ? "Update Profile" : "Register Company"}
              </button>
              
              ${isEditMode ? `
                <button 
                  onclick="alert('Edit cancelled - you can close this form');" 
                  style="
                    width: 100%; 
                    background-color: #6b7280; 
                    color: white; 
                    border: none; 
                    padding: 10px; 
                    border-radius: 8px; 
                    font-size: 14px; 
                    cursor: pointer;
                    margin-top: 10px;
                  "
                  onmouseover="this.style.backgroundColor='#4b5563';"
                  onmouseout="this.style.backgroundColor='#6b7280';"
                >
                  Cancel
                </button>
              ` : ''}
            </div>
          `
        }}
      />
      
      {/* Status displays for loading states - only visible when needed */}
      {!user && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      )}
        
      {isCheckingRegistration && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking registration status...</p>
        </div>
      )}
    </div>
  );
}
