/*
  Warnings:

  - The `unit` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "price" DROP NOT NULL,
DROP COLUMN "unit",
ADD COLUMN     "unit" DOUBLE PRECISION;
