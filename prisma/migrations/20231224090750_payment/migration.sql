/*
  Warnings:

  - Added the required column `transactionId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "paymentGatewayData" JSONB,
ADD COLUMN     "transactionId" TEXT NOT NULL,
ALTER COLUMN "paymentStatus" SET DEFAULT 'pending';
