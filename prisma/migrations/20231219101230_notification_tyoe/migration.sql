/*
  Warnings:

  - Added the required column `notificationType` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('promotional', 'order', 'product', 'service');

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "notificationType" "NotificationType" NOT NULL;
