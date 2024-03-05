/*
  Warnings:

  - Made the column `brandId` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subCategoryId` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "brandId" SET NOT NULL,
ALTER COLUMN "subCategoryId" SET NOT NULL,
ALTER COLUMN "stock" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "unit" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
