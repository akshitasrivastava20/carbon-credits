-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "additionalBenefits" TEXT,
ADD COLUMN     "certificationStandard" TEXT NOT NULL DEFAULT 'VCS',
ADD COLUMN     "coordinates" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT '2030-12-31 00:00:00 +00:00',
ADD COLUMN     "estimatedCO2Reduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "methodology" TEXT NOT NULL DEFAULT 'To be determined',
ADD COLUMN     "projectDeveloper" TEXT NOT NULL DEFAULT 'Independent Developer',
ADD COLUMN     "projectStatus" TEXT NOT NULL DEFAULT 'development',
ADD COLUMN     "projectType" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN     "riskFactors" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'pending';
