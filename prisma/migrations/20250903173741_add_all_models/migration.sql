/*
  Warnings:

  - You are about to drop the column `electricityKWh` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `fuelUsage` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `industryType` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."UsageType" AS ENUM ('ELECTRICITY', 'DIESEL', 'PETROL', 'NATURAL_GAS');

-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "electricityKWh",
DROP COLUMN "fuelUsage",
DROP COLUMN "industryType",
ADD COLUMN     "clerkUserId" TEXT,
ADD COLUMN     "industry" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "certificateUrl" DROP NOT NULL,
ALTER COLUMN "taxId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Usage" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" "public"."UsageType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmissionFactor" (
    "id" TEXT NOT NULL,
    "type" "public"."UsageType" NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "EmissionFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerCredit" DOUBLE PRECISION NOT NULL,
    "totalCredits" INTEGER NOT NULL,
    "availableCredits" INTEGER NOT NULL,
    "projectImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Investment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "creditsBought" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmissionFactor_type_key" ON "public"."EmissionFactor"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Company_clerkUserId_key" ON "public"."Company"("clerkUserId");

-- AddForeignKey
ALTER TABLE "public"."Usage" ADD CONSTRAINT "Usage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Investment" ADD CONSTRAINT "Investment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Investment" ADD CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
