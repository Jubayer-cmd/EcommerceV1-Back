-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "image" TEXT,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
