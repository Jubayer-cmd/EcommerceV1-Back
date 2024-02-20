-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('default', 'first_order');

-- AlterTable
ALTER TABLE "coupon" ADD COLUMN     "couponType" "CouponType";
