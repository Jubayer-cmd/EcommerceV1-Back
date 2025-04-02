/*
  Warnings:

  - You are about to drop the column `basePrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `product_attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_attribute_value` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variant_attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variant_image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_attribute_value" DROP CONSTRAINT "product_attribute_value_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "product_variant_attribute" DROP CONSTRAINT "product_variant_attribute_attributeValueId_fkey";

-- DropForeignKey
ALTER TABLE "product_variant_attribute" DROP CONSTRAINT "product_variant_attribute_variantId_fkey";

-- DropForeignKey
ALTER TABLE "product_variant_image" DROP CONSTRAINT "product_variant_image_variantId_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "basePrice",
DROP COLUMN "quantity",
DROP COLUMN "stock",
ADD COLUMN     "comparePrice" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product_variant" ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "product_attribute";

-- DropTable
DROP TABLE "product_attribute_value";

-- DropTable
DROP TABLE "product_variant_attribute";

-- DropTable
DROP TABLE "product_variant_image";
