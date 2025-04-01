/*
  Warnings:

  - You are about to drop the `coupon` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `promotion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConditionType" ADD VALUE 'specific_categories';
ALTER TYPE "ConditionType" ADD VALUE 'first_time_purchase';
ALTER TYPE "ConditionType" ADD VALUE 'user_role';
ALTER TYPE "ConditionType" ADD VALUE 'time_of_day';
ALTER TYPE "ConditionType" ADD VALUE 'day_of_week';
ALTER TYPE "ConditionType" ADD VALUE 'quantity_threshold';
ALTER TYPE "ConditionType" ADD VALUE 'total_items';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PromotionType" ADD VALUE 'bundle_deal';
ALTER TYPE "PromotionType" ADD VALUE 'bogo';
ALTER TYPE "PromotionType" ADD VALUE 'free_shipping';
ALTER TYPE "PromotionType" ADD VALUE 'new_customer';
ALTER TYPE "PromotionType" ADD VALUE 'loyalty_reward';

-- DropForeignKey
ALTER TABLE "promotion_conditions" DROP CONSTRAINT "promotion_conditions_promotionId_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "appliedPromotionId" TEXT,
ADD COLUMN     "discountAmount" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "promotion" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "discountType" "DiscountType" NOT NULL,
ADD COLUMN     "maxDiscount" DOUBLE PRECISION,
ADD COLUMN     "minPurchase" DOUBLE PRECISION,
ADD COLUMN     "usageLimit" INTEGER,
ADD COLUMN     "usageLimitPerUser" INTEGER;

-- AlterTable
ALTER TABLE "promotion_conditions" ADD COLUMN     "jsonValue" JSONB;

-- DropTable
DROP TABLE "coupon";

-- CreateTable
CREATE TABLE "promotion_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "orderId" TEXT,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_product" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "promotion_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_category" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "promotion_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promotion_product_promotionId_productId_key" ON "promotion_product"("promotionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_category_promotionId_categoryId_key" ON "promotion_category"("promotionId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_code_key" ON "promotion"("code");

-- AddForeignKey
ALTER TABLE "promotion_conditions" ADD CONSTRAINT "promotion_conditions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_usage" ADD CONSTRAINT "promotion_usage_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_product" ADD CONSTRAINT "promotion_product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_product" ADD CONSTRAINT "promotion_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_category" ADD CONSTRAINT "promotion_category_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_category" ADD CONSTRAINT "promotion_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
