-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('promotional', 'order', 'product', 'service');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('default', 'first_order');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed_amount');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('online', 'COD');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('superAdmin', 'admin', 'user');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'canceled');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'canceled', 'completed');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'closed', 'pending');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('minimum_purchase_amount', 'specific_products', 'specific_categories', 'first_time_purchase', 'user_role', 'time_of_day', 'day_of_week', 'quantity_threshold', 'total_items');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('discount', 'flash_sale', 'seasonal_offer', 'bundle_deal', 'bogo', 'free_shipping', 'new_customer', 'loyalty_reward');

-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK');

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "orderId" TEXT,
    "productId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_ticket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "note" TEXT,
    "phone" TEXT NOT NULL,
    "appliedPromotionId" TEXT,
    "discountAmount" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_product" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "order_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transactionId" TEXT NOT NULL,
    "paymentGatewayData" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "shortDescription" VARCHAR(500),
    "metaTitle" VARCHAR(60),
    "metaDescription" VARCHAR(160),
    "slug" VARCHAR(255),
    "status" "product_status" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "thumbnailUrl" TEXT,
    "videoUrl" TEXT,
    "option1Name" VARCHAR(50),
    "option2Name" VARCHAR(50),
    "option3Name" VARCHAR(50),
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comparePrice" DOUBLE PRECISION,
    "costPrice" DOUBLE PRECISION,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "sku" VARCHAR(100),
    "barcode" VARCHAR(100),
    "trackQuantity" BOOLEAN NOT NULL DEFAULT true,
    "weight" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "requiresShipping" BOOLEAN NOT NULL DEFAULT true,
    "shippingClass" VARCHAR(50),
    "hasVariants" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "brandId" TEXT,
    "categoryId" TEXT,
    "subCategoryId" TEXT,
    "unitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "option1Value" VARCHAR(100),
    "option2Value" VARCHAR(100),
    "option3Value" VARCHAR(100),
    "sku" VARCHAR(100) NOT NULL,
    "barcode" VARCHAR(100),
    "price" DOUBLE PRECISION NOT NULL,
    "comparePrice" DOUBLE PRECISION,
    "costPrice" DOUBLE PRECISION,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "trackQuantity" BOOLEAN NOT NULL DEFAULT true,
    "lowStockThreshold" INTEGER,
    "weight" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_collection" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_on_collection" (
    "productId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_on_collection_pkey" PRIMARY KEY ("productId","collectionId")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "product_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "product_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "maxDiscount" DOUBLE PRECISION,
    "usageLimit" INTEGER,
    "usageLimitPerUser" INTEGER,
    "minPurchase" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_conditions" (
    "id" TEXT NOT NULL,
    "conditionType" "ConditionType" NOT NULL,
    "value" TEXT NOT NULL,
    "jsonValue" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "promotionId" TEXT NOT NULL,

    CONSTRAINT "promotion_conditions_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "role" "Role" DEFAULT 'user',
    "phone" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_files" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "description" TEXT DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToWishlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_key" ON "cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_barcode_key" ON "product"("barcode");

-- CreateIndex
CREATE INDEX "product_status_isActive_idx" ON "product"("status", "isActive");

-- CreateIndex
CREATE INDEX "product_categoryId_isActive_idx" ON "product"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "product_brandId_isActive_idx" ON "product"("brandId", "isActive");

-- CreateIndex
CREATE INDEX "product_slug_idx" ON "product"("slug");

-- CreateIndex
CREATE INDEX "product_createdAt_idx" ON "product"("createdAt");

-- CreateIndex
CREATE INDEX "product_isFeatured_isActive_idx" ON "product"("isFeatured", "isActive");

-- CreateIndex
CREATE INDEX "product_option1Name_option2Name_option3Name_idx" ON "product"("option1Name", "option2Name", "option3Name");

-- CreateIndex
CREATE INDEX "product_name_idx" ON "product"("name");

-- CreateIndex
CREATE INDEX "product_tags_idx" ON "product"("tags");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_sku_key" ON "product_variant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_barcode_key" ON "product_variant"("barcode");

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE INDEX "product_variant_productId_option1Value_option2Value_option3_idx" ON "product_variant"("productId", "option1Value", "option2Value", "option3Value");

-- CreateIndex
CREATE INDEX "product_variant_sku_idx" ON "product_variant"("sku");

-- CreateIndex
CREATE INDEX "product_variant_isActive_idx" ON "product_variant"("isActive");

-- CreateIndex
CREATE INDEX "product_variant_stockQuantity_idx" ON "product_variant"("stockQuantity");

-- CreateIndex
CREATE UNIQUE INDEX "product_collection_slug_key" ON "product_collection"("slug");

-- CreateIndex
CREATE INDEX "product_collection_isActive_idx" ON "product_collection"("isActive");

-- CreateIndex
CREATE INDEX "product_collection_slug_idx" ON "product_collection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_code_key" ON "promotion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_product_promotionId_productId_key" ON "promotion_product"("promotionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_category_promotionId_categoryId_key" ON "promotion_category"("promotionId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE INDEX "_ProductToWishlist_B_index" ON "_ProductToWishlist"("B");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_collection" ADD CONSTRAINT "product_on_collection_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_on_collection" ADD CONSTRAINT "product_on_collection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "product_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_question" ADD CONSTRAINT "product_question_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_question" ADD CONSTRAINT "product_question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "user_review" ADD CONSTRAINT "user_review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_review" ADD CONSTRAINT "user_review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToWishlist" ADD CONSTRAINT "_ProductToWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToWishlist" ADD CONSTRAINT "_ProductToWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
