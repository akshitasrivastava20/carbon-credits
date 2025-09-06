import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Get the authenticated user's ID from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,                 
          error: "User authentication required. Please sign in to add a project." 
        }, 
        { status: 401 }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'pricePerCredit', 'totalCredits', 'availableCredits'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `${field} is required` 
          }, 
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    const pricePerCredit = parseFloat(body.pricePerCredit);
    const totalCredits = parseInt(body.totalCredits);
    const availableCredits = parseInt(body.availableCredits);

    if (isNaN(pricePerCredit) || pricePerCredit <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Price per credit must be a valid number greater than 0" 
        }, 
        { status: 400 }
      );
    }

    if (isNaN(totalCredits) || totalCredits <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Total credits must be a valid number greater than 0" 
        }, 
        { status: 400 }
      );
    }

    if (isNaN(availableCredits) || availableCredits < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Available credits must be a valid number greater than or equal to 0" 
        }, 
        { status: 400 }
      );
    }

    if (availableCredits > totalCredits) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Available credits cannot be greater than total credits" 
        }, 
        { status: 400 }
      );
    }

    // Validate project images
    if (!body.projectImages || !Array.isArray(body.projectImages) || body.projectImages.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "At least one project image is required" 
        }, 
        { status: 400 }
      );
    }

    if (body.projectImages.length > 5) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Maximum 5 images allowed per project" 
        }, 
        { status: 400 }
      );
    }

    // Validate image URLs
    for (const imageUrl of body.projectImages) {
      if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        return NextResponse.json(
          { 
            success: false, 
            error: "All project images must be valid URLs" 
          }, 
          { status: 400 }
        );
      }
    }

    // Create project in database (with retry)
    const project = await withRetry(() => 
      prisma.project.create({
        data: {
          title: body.title.trim(),
          description: body.description.trim(),
          location: body.location.trim(),
          pricePerCredit: pricePerCredit,
          totalCredits: totalCredits,
          availableCredits: availableCredits,
          projectImages: body.projectImages.map((url: string) => url.trim()),
        }
      })
    );

    return NextResponse.json({ 
      success: true, 
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        pricePerCredit: project.pricePerCredit,
        totalCredits: project.totalCredits,
        availableCredits: project.availableCredits,
        projectImages: project.projectImages,
        createdAt: project.createdAt,
      },
      message: "Project created successfully"
    });

  } catch (error: any) {
    console.error("Project creation error:", error);
    
    // Handle specific database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return NextResponse.json({ 
        success: false, 
        error: "Database is temporarily unavailable. Please try again in a moment." 
      }, { status: 503 });
    }
    
    // Handle other Prisma errors
    if (error.code?.startsWith('P')) {
      return NextResponse.json({ 
        success: false, 
        error: "Database error occurred. Please try again." 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Something went wrong while creating the project. Please try again." 
    }, { status: 500 });
    
  } finally {
    // Ensure the Prisma client is disconnected
    await prisma.$disconnect();
  }
}
