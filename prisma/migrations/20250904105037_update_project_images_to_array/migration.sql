/*
  Warnings:

  - You are about to drop the column `projectImage` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "projectImage",
ADD COLUMN     "projectImages" TEXT[];
