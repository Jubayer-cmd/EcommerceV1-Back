-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "loginCount" INTEGER,
    "registerCount" INTEGER,
    "orderProductCount" INTEGER,
    "productReviewCount" INTEGER,
    "totalSellMonthly" DOUBLE PRECISION,
    "totalSellWeekly" DOUBLE PRECISION,
    "totalSellYearly" DOUBLE PRECISION,
    "totalProduct" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);
