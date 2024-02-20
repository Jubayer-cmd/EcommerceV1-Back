/*
  Warnings:

  - You are about to drop the column `description` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the `carousel_image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homepage_carousel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discountType` to the `coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expireDate` to the `coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `coupon` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed_amount');

-- AlterTable
ALTER TABLE "coupon" DROP COLUMN "description",
DROP COLUMN "validFrom",
DROP COLUMN "validTo",
ADD COLUMN     "discountType" "DiscountType" NOT NULL,
ADD COLUMN     "expireDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxDiscount" DOUBLE PRECISION,
ADD COLUMN     "minPurchase" DOUBLE PRECISION,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "carousel_image";

-- DropTable
DROP TABLE "homepage_carousel";
