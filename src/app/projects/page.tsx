"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CarbonProjectsDisplay } from "@/components/CarbonProjectsDisplay";

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerCredit: number;
  totalCredits: number;
  availableCredits: number;
  projectImages: string[];
  createdAt: string;
  updatedAt: string;
  // Enhanced fields from API
  creditsSold?: number;
  totalRevenue?: number;
  investorCount?: number;
  isFullyFunded?: boolean;
  fundingPercentage?: number;
}

interface ProjectsResponse {
  success: boolean;
  projects: Project[];
  count: number;
  summary?: {
    totalProjects: number;
    totalCreditsAvailable: number;
    totalCreditsIssued: number;
    averagePrice: number;
    totalRevenue: number;
    activeProjects: number;
    fullyFundedProjects: number;
  };
  error?: string;
}

export default function ProjectsPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<ProjectsResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects from /api/projects...");
        const response = await fetch("/api/projects");
        const data: ProjectsResponse = await response.json();
        
        console.log("API Response:", data);

        if (data.success) {
          console.log("Projects fetched successfully:", data.projects);
          console.log("Project images sample:", data.projects.map(p => ({ 
            title: p.title, 
            images: p.projectImages 
          })));
          
          setProjects(data.projects);
          setSummary(data.summary || null);
        } else {
          console.error("API Error:", data.error);
          setError(data.error || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Transform projects data to match CarbonProjectsDisplay component props
  const transformedProjects = projects.map(project => {
    const fundingPercentage = project.fundingPercentage || ((project.totalCredits - project.availableCredits) / project.totalCredits) * 100;
    
    // Create comprehensive tags array
    const tags = [
      "Carbon Credits",
      `$${project.pricePerCredit}/credit`,
      `${project.availableCredits.toLocaleString()}/${project.totalCredits.toLocaleString()} available`,
    ];

    // Add status-based tags with better formatting
    if (project.isFullyFunded || project.availableCredits === 0) {
      tags.push("🔴 Fully Funded");
    } else if (fundingPercentage > 75) {
      tags.push("🟡 Almost Full");
    } else if (fundingPercentage > 50) {
      tags.push("🟠 Half Funded");
    } else {
      tags.push("🟢 Available");
    }

    // Add investor count if available
    if (project.investorCount && project.investorCount > 0) {
      tags.push(`👥 ${project.investorCount} investor${project.investorCount > 1 ? 's' : ''}`);
    }

    // Ensure we have a valid image URL, prioritize actual project images
    let imageUrl = "/images/placeholder-project.jpg"; // Default fallback
    
    if (project.projectImages && project.projectImages.length > 0) {
      const firstImage = project.projectImages[0];
      // Check if it's a valid URL (either IPFS or regular URL)
      if (firstImage && (firstImage.startsWith('http') || firstImage.startsWith('https://') || firstImage.startsWith('ipfs://'))) {
        imageUrl = firstImage;
      }
    }

    return {
      id: project.id,
      title: project.title,
      summary: project.description.length > 200 
        ? `${project.description.substring(0, 200).trim()}...` 
        : project.description,
      author: `📍 ${project.location}`,
      published: new Date(project.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      image: imageUrl,
      tags: tags,
      // Additional fields for carbon projects
      pricePerCredit: project.pricePerCredit,
      availableCredits: project.availableCredits,
      totalCredits: project.totalCredits,
      location: project.location,
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Loading Projects...</h1>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Error Loading Projects</h1>
            <p className="text-red-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Carbon Credit Projects</h1>
            <p className="text-gray-600 mt-2">
              Discover and invest in verified carbon reduction projects
            </p>
          </div>
          
          {user && (
            <div className="flex gap-4">
              <Link 
                href="/addProject" 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Add Project
              </Link>
              <Link 
                href="/" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-green-600">{summary?.totalProjects || projects.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {summary?.activeProjects || 0} active • {summary?.fullyFundedProjects || 0} funded
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Credits Available</h3>
            <p className="text-3xl font-bold text-blue-600">
              {(summary?.totalCreditsAvailable || projects.reduce((sum, project) => sum + project.availableCredits, 0)).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              of {(summary?.totalCreditsIssued || 0).toLocaleString()} total
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Price</h3>
            <p className="text-3xl font-bold text-purple-600">
              ${summary?.averagePrice 
                ? summary.averagePrice.toFixed(2)
                : projects.length > 0 
                  ? (projects.reduce((sum, project) => sum + project.pricePerCredit, 0) / projects.length).toFixed(2)
                  : '0.00'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">per credit</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-emerald-600">
              ${(summary?.totalRevenue || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">from investments</p>
          </div>
        </div>
      </div>

      {/* Projects Section using Blog8 Component */}
      {projects.length > 0 ? (
        <>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="container mx-auto px-4 mb-4">
              <details className="bg-gray-100 p-4 rounded">
                <summary className="cursor-pointer font-medium">Debug: Transformed Projects Data</summary>
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(transformedProjects.slice(0, 2), null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <CarbonProjectsDisplay
            heading="Available Carbon Credit Projects"
            description="Invest in verified environmental projects that generate carbon credits. Each project contributes to global climate action while providing you with tradeable carbon offsets."
            projects={transformedProjects}
          />
        </>
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Projects Available</h2>
            <p className="text-gray-600 mb-8">
              There are currently no carbon credit projects listed. 
              {user ? " Would you like to add the first project?" : " Please check back later."}
            </p>
            {user && (
              <Link 
                href="/addProject" 
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center"
              >
                Add First Project
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
