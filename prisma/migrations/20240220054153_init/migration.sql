-- CreateEnum
CREATE TYPE "FlashSaleProductStatus" AS ENUM ('pending', 'active', 'expired');

-- AlterTable
ALTER TABLE "flash_sale_product" ADD COLUMN     "flasSaleProductSatus" "FlashSaleProductStatus";
