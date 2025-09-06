-- Create EmissionFactor table
CREATE TABLE IF NOT EXISTS "public"."EmissionFactor" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    CONSTRAINT "EmissionFactor_pkey" PRIMARY KEY ("id")
);

-- Create Usage table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."Usage" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
ALTER TABLE "public"."Usage" 
ADD CONSTRAINT "Usage_companyId_fkey" 
FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create unique constraint on EmissionFactor type
CREATE UNIQUE INDEX IF NOT EXISTS "EmissionFactor_type_key" ON "public"."EmissionFactor"("type");

-- Update Company table structure (add missing columns, drop unused ones)
ALTER TABLE "public"."Company" 
DROP COLUMN IF EXISTS "industryType",
DROP COLUMN IF EXISTS "electricityKWh", 
DROP COLUMN IF EXISTS "fuelUsage";

ALTER TABLE "public"."Company" 
ADD COLUMN IF NOT EXISTS "clerkUserId" TEXT,
ADD COLUMN IF NOT EXISTS "industry" TEXT;

-- Add unique constraint on clerkUserId
CREATE UNIQUE INDEX IF NOT EXISTS "Company_clerkUserId_key" ON "public"."Company"("clerkUserId");

-- Make some Company fields optional
ALTER TABLE "public"."Company" 
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "certificateUrl" DROP NOT NULL,
ALTER COLUMN "taxId" DROP NOT NULL,
ALTER COLUMN "industry" DROP NOT NULL;
