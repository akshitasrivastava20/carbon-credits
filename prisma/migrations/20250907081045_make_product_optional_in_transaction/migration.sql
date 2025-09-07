-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_productId_fkey";

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
