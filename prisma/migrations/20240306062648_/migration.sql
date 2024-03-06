/*
  Warnings:

  - You are about to drop the column `variations` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductVariation" ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "variations";

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
