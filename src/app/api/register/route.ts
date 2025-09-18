import { NextResponse } from "next/server";
import { PrismaClient, UsageType } from "@prisma/client";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

// For file uploads use Cloudinary, S3 etc.
// For now we'll just accept a URL passed from frontend.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Get the authenticated user's ID from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,                 
          error: "User authentication required. Please sign in to register your company." 
        }, 
        { status: 401 }
      );
    }
    
    // Get the user's email from Clerk to validate against the form email
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const clerkEmail = user.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!clerkEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unable to verify your email address. Please ensure your account has a verified email." 
        }, 
        { status: 400 }
      );
    }
    
    // Validate that the form email matches the Clerk user's email
    if (body.email !== clerkEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Email mismatch. The email address in the form (${body.email}) must match your account email (${clerkEmail}). Please use your account email or update your account email first.` 
        }, 
        { status: 400 }
      );
    }

    // Check if company with this email already exists (with retry)
    const existingCompany = await withRetry(() => 
      prisma.company.findUnique({
        where: {
          email: body.email,
        },
      })
    );

    if (existingCompany) {
      return NextResponse.json(
        { 
          success: false, 
          error: "A company with this email address already has an account. Please use a different email or contact support if this is your company." 
        }, 
        { status: 409 }
      );
    }

    // Check if this user has already registered a company (with retry)
    const existingUserCompany = await withRetry(() => 
      prisma.company.findUnique({
        where: {
          clerkUserId: userId,
        },
      })
    );

    if (existingUserCompany) {
      return NextResponse.json(
        { 
          success: false, 
          error: "You have already registered a company. Each user can only register one company." 
        }, 
        { status: 409 }
      );
    }

    // Validate numeric fields if provided (now optional since we moved them to Usage model)
    if (body.electricityKWh) {
      const electricityKWh = parseFloat(body.electricityKWh);
      if (isNaN(electricityKWh) || electricityKWh < 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Please provide a valid electricity consumption value (kWh)." 
          }, 
          { status: 400 }
        );
      }
    }

    if (body.fuelUsage) {
      const fuelUsage = parseFloat(body.fuelUsage);
      if (isNaN(fuelUsage) || fuelUsage < 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Please provide a valid fuel usage value." 
          }, 
          { status: 400 }
        );
      }
    }

    // Create company with the new schema structure (with retry)
    const company = await withRetry(() => 
      prisma.company.create({
        data: {
          clerkUserId: userId,
          name: body.name,
          industry: body.industryType || body.industry,
          email: body.email,
          address: body.address,
          certificateUrl: body.certificateUrl,
          taxId: body.taxId,
          status: "pending",
          // Create initial usage records if provided
          usages: {
            create: [
              // Add electricity usage if provided
              ...(body.electricityKWh ? [{
                type: UsageType.ELECTRICITY,
                amount: parseFloat(body.electricityKWh)
              }] : []),
              // Add fuel usage if provided (assuming diesel for backward compatibility)
              ...(body.fuelUsage ? [{
                type: UsageType.DIESEL,
                amount: parseFloat(body.fuelUsage)
              }] : [])
            ]
          }
        },
        include: {
          usages: true
        }
      })
    );

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    console.error("Registration error:", error);
    
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
      error: "Something went wrong. Please try again." 
    }, { status: 500 });
  } finally {
    // Ensure the Prisma client is disconnected
    await prisma.$disconnect();
  }
}

// PUT endpoint for updating company profile
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // Get the authenticated user's ID from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User not authenticated. Please sign in to update your profile." 
        }, 
        { status: 401 }
      );
    }
    
    // Get the user's email from Clerk to validate against the form email
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const clerkEmail = user.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!clerkEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unable to verify your email address. Please ensure your account has a verified email." 
        }, 
        { status: 400 }
      );
    }
    
    // Validate that the form email matches the Clerk user's email (if email is being updated)
    if (body.email && body.email !== clerkEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Email mismatch. The email address in the form (${body.email}) must match your account email (${clerkEmail}). Please use your account email or update your account email first.` 
        }, 
        { status: 400 }
      );
    }

    // Find the existing company
    const existingCompany = await withRetry(() => 
      prisma.company.findUnique({
        where: { clerkUserId: userId },
        include: { usages: true }
      })
    );

    if (!existingCompany) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Company not found. Please register first." 
        }, 
        { status: 404 }
      );
    }

    // Check if email is being changed and if it conflicts with another company
    if (body.email && body.email !== existingCompany.email) {
      const emailConflict = await withRetry(() => 
        prisma.company.findUnique({
          where: { email: body.email }
        })
      );

      if (emailConflict) {
        return NextResponse.json(
          { 
            success: false, 
            error: "A company with this email address already exists." 
          }, 
          { status: 409 }
        );
      }
    }

    // Validate numeric fields if provided
    if (body.electricityKWh) {
      const electricityKWh = parseFloat(body.electricityKWh);
      if (isNaN(electricityKWh) || electricityKWh < 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Please provide a valid electricity consumption value (kWh)." 
          }, 
          { status: 400 }
        );
      }
    }

    if (body.fuelUsage) {
      const fuelUsage = parseFloat(body.fuelUsage);
      if (isNaN(fuelUsage) || fuelUsage < 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Please provide a valid fuel usage value." 
          }, 
          { status: 400 }
        );
      }
    }

    // Update company data
    const updatedCompany = await withRetry(() => 
      prisma.company.update({
        where: { clerkUserId: userId },
        data: {
          name: body.name,
          industry: body.industryType || body.industry,
          email: body.email,
          address: body.address,
          certificateUrl: body.certificateUrl,
          taxId: body.taxId,
        },
        include: { usages: true }
      })
    );

    // Update or create usage records
    if (body.electricityKWh !== undefined || body.fuelUsage !== undefined) {
      // Delete existing usage records if we're updating them
      await withRetry(() => 
        prisma.usage.deleteMany({
          where: { companyId: existingCompany.id }
        })
      );

      // Create new usage records if provided
      const usageRecords: Array<{companyId: string, type: UsageType, amount: number}> = [];
      if (body.electricityKWh) {
        usageRecords.push({
          companyId: existingCompany.id,
          type: UsageType.ELECTRICITY,
          amount: parseFloat(body.electricityKWh)
        });
      }
      if (body.fuelUsage) {
        usageRecords.push({
          companyId: existingCompany.id,
          type: UsageType.DIESEL,
          amount: parseFloat(body.fuelUsage)
        });
      }

      if (usageRecords.length > 0) {
        await withRetry(() => 
          prisma.usage.createMany({
            data: usageRecords
          })
        );
      }
    }

    // Fetch the updated company with usages
    const finalCompany = await withRetry(() => 
      prisma.company.findUnique({
        where: { clerkUserId: userId },
        include: { usages: true }
      })
    );

    return NextResponse.json({ success: true, company: finalCompany });
  } catch (error: any) {
    console.error("Profile update error:", error);
    
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
      error: "Something went wrong. Please try again." 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
