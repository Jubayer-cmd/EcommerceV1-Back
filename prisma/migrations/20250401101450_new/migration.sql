-- AlterTable
ALTER TABLE "_ProductToWishlist" ADD CONSTRAINT "_ProductToWishlist_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProductToWishlist_AB_unique";
