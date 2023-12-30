-- AlterTable
ALTER TABLE "promotion" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "carousel_image" (
    "id" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carousel_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_carousel" (
    "id" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "files" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_carousel_pkey" PRIMARY KEY ("id")
);
