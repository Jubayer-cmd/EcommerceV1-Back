/*
  Warnings:

  - You are about to drop the column `products` on the `flash_sale` table. All the data in the column will be lost.
  - You are about to drop the column `flashSaleProduct` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "flash_sale" DROP COLUMN "products";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "flashSaleProduct";

-- DropEnum
DROP TYPE "FlashSaleProduct";

-- CreateTable
CREATE TABLE "flash_sale_product" (
    "id" TEXT NOT NULL,
    "flashSaleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "discount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flash_sale_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flash_sale_product" ADD CONSTRAINT "flash_sale_product_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "flash_sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_product" ADD CONSTRAINT "flash_sale_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
