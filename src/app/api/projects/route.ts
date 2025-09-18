import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to retry database operations
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      // Check if it's a connection error
      if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
        console.log(`Database connection attempt ${attempt} failed, retrying...`);
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      // If it's not a connection error, don't retry
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export async function GET() {
  try {
    // Fetch all projects from the database (with retry)
    const projects = await withRetry(() => 
      prisma.project.findMany({
        orderBy: {
          createdAt: 'desc' // Most recent projects first
        },
        include: {
          investments: {
            select: {
              id: true,
              creditsBought: true,
              totalPrice: true,
              createdAt: true,
              company: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      })
    );

    // Transform projects to include additional calculated fields
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      location: project.location,
      pricePerCredit: project.pricePerCredit,
      totalCredits: project.totalCredits,
      availableCredits: project.availableCredits,
      projectImages: project.projectImages,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      // Additional calculated fields
      creditsSold: project.totalCredits - project.availableCredits,
      totalRevenue: project.investments.reduce((sum, investment) => sum + investment.totalPrice, 0),
      investorCount: project.investments.length,
      isFullyFunded: project.availableCredits === 0,
      fundingPercentage: ((project.totalCredits - project.availableCredits) / project.totalCredits) * 100,
    }));

    return NextResponse.json({
      success: true,
      projects: transformedProjects,
      count: transformedProjects.length,
      summary: {
        totalProjects: transformedProjects.length,
        totalCreditsAvailable: transformedProjects.reduce((sum, p) => sum + p.availableCredits, 0),
        totalCreditsIssued: transformedProjects.reduce((sum, p) => sum + p.totalCredits, 0),
        averagePrice: transformedProjects.length > 0 
          ? transformedProjects.reduce((sum, p) => sum + p.pricePerCredit, 0) / transformedProjects.length
          : 0,
        totalRevenue: transformedProjects.reduce((sum, p) => sum + p.totalRevenue, 0),
        activeProjects: transformedProjects.filter(p => p.availableCredits > 0).length,
        fullyFundedProjects: transformedProjects.filter(p => p.isFullyFunded).length,
      }
    });

  } catch (error: any) {
    console.error("Projects fetch error:", error);
    
    // Handle specific database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return NextResponse.json({ 
        success: false, 
        error: "Database is temporarily unavailable. Please try again in a moment.",
        projects: [],
        count: 0
      }, { status: 503 });
    }
    
    // Handle other Prisma errors
    if (error.code?.startsWith('P')) {
      return NextResponse.json({ 
        success: false, 
        error: "Database error occurred while fetching projects.",
        projects: [],
        count: 0
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch projects. Please try again.",
      projects: [],
      count: 0
    }, { status: 500 });
    
  } finally {
    // Ensure the Prisma client is disconnected
    await prisma.$disconnect();
  }
}
