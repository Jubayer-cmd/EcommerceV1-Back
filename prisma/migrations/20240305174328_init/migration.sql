/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductVariation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariation" DROP CONSTRAINT "ProductVariation_productId_fkey";

-- AlterTable
ALTER TABLE "ProductVariation" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "variations" TEXT;
