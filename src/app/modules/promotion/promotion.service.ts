import {
  ConditionType,
  DiscountType,
  Promotion,
  PromotionType,
  Prisma,
} from '@prisma/client';
import prisma from '../../../utils/prisma';
import ApiError from '../../../errors/ApiError';
import {
  ICartItem,
  ICreatePromotion,
  IPromotionConditionResponse,
  IPromotionFilters,
  IPromotionResponse,
  IPromotionUsage,
  IUpdatePromotion,
  IValidatePromotion,
  IPromotionWithRelations,
} from './promotion.interface';

/**
 * Creates a new promotion in the database
 * @param data - The promotion data
 * @returns The created promotion with its relations
 */
const insertIntoDB = async (data: ICreatePromotion): Promise<Promotion> => {
  const {
    name,
    code,
    image,
    description,
    type,
    startDate,
    endDate,
    discount,
    discountType,
    maxDiscount,
    usageLimit,
    usageLimitPerUser,
    minPurchase,
    conditions,
    productIds,
    categoryIds,
  } = data;

  // Check if promotion with this code already exists
  const existingPromotion = await prisma.promotion.findFirst({
    where: { code },
  });

  if (existingPromotion) {
    throw new ApiError(400, 'Promotion code already exists');
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create promotion
    const promotion = await tx.promotion.create({
      data: {
        name,
        code,
        image,
        description,
        type: type as PromotionType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        discount,
        discountType: discountType as DiscountType,
        maxDiscount,
        usageLimit,
        usageLimitPerUser,
        minPurchase,
      },
    });

    // Add promotion conditions if provided
    if (conditions && conditions.length > 0) {
      await tx.promotionConditions.createMany({
        data: conditions.map((condition) => ({
          promotionId: promotion.id,
          conditionType: condition.conditionType as ConditionType,
          value: condition.value,
          jsonValue: condition.jsonValue || null,
        })),
      });
    }

    // Link products if provided
    if (productIds && productIds.length > 0) {
      await tx.promotionProduct.createMany({
        data: productIds.map((productId) => ({
          promotionId: promotion.id,
          productId,
        })),
      });
    }

    // Link categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await tx.promotionCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          promotionId: promotion.id,
          categoryId,
        })),
      });
    }

    return promotion;
  });

  // Return the created promotion with all relations
  const createdPromotion = await prisma.promotion.findUnique({
    where: { id: result.id },
    include: {
      conditions: true,
      promotionProduct: {
        include: {
          product: true,
        },
      },
      promotionCategory: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!createdPromotion) {
    throw new ApiError(500, 'Failed to retrieve created promotion');
  }

  return createdPromotion;
};

const getAllFromDb = async (
  options: IPromotionFilters = {},
): Promise<{
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const { active, page = 1, limit = 10, sortBy, sortOrder } = options;

  const skip = (page - 1) * limit;
  const take = limit;

  const where: Record<string, any> = {};

  if (active === true || active === 'true') {
    const now = new Date();
    where.isActive = true;
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  }

  const orderBy: Record<string, string> = {};
  if (sortBy && sortOrder) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }

  const [promotions, total] = await Promise.all([
    prisma.promotion.findMany({
      where,
      include: {
        conditions: true,
        promotionProduct: {
          include: {
            product: { select: { id: true, name: true, image: true } },
          },
        },
        promotionCategory: {
          include: { category: { select: { id: true, name: true } } },
        },
        _count: {
          select: { promotionUsage: true },
        },
      },
      skip,
      take,
      orderBy,
    }),
    prisma.promotion.count({ where }),
  ]);

  return {
    data: promotions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPromotionById = async (id: string): Promise<any> => {
  const promotion = await prisma.promotion.findUnique({
    where: { id },
    include: {
      conditions: true,
      promotionProduct: {
        include: { product: true },
      },
      promotionCategory: {
        include: { category: true },
      },
      promotionUsage: {
        take: 10,
        orderBy: {
          usedAt: 'desc',
        },
      },
    },
  });

  if (!promotion) {
    throw new ApiError(404, 'Promotion not found');
  }

  return promotion;
};

const updateIntoDB = async (
  id: string,
  payload: IUpdatePromotion,
): Promise<any> => {
  const {
    name,
    image,
    description,
    type,
    startDate,
    endDate,
    discount,
    discountType,
    maxDiscount,
    usageLimit,
    usageLimitPerUser,
    minPurchase,
    isActive,
    conditions,
    productIds,
    categoryIds,
  } = payload;

  // Check if promotion exists
  const existingPromotion = await prisma.promotion.findUnique({
    where: { id },
  });

  if (!existingPromotion) {
    throw new ApiError(404, 'Promotion not found');
  }

  const updateData: any = {};

  // Only include fields that are provided in the payload
  if (name !== undefined) updateData.name = name;
  if (image !== undefined) updateData.image = image;
  if (description !== undefined) updateData.description = description;
  if (type !== undefined) updateData.type = type;
  if (startDate !== undefined) updateData.startDate = new Date(startDate);
  if (endDate !== undefined) updateData.endDate = new Date(endDate);
  if (discount !== undefined) updateData.discount = discount;
  if (discountType !== undefined) updateData.discountType = discountType;
  if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount;
  if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
  if (usageLimitPerUser !== undefined)
    updateData.usageLimitPerUser = usageLimitPerUser;
  if (minPurchase !== undefined) updateData.minPurchase = minPurchase;
  if (isActive !== undefined) updateData.isActive = isActive;

  const result = await prisma.$transaction(async (tx) => {
    // Update promotion
    const updatedPromotion = await tx.promotion.update({
      where: { id },
      data: updateData,
    });

    // Update conditions if provided
    if (conditions !== undefined) {
      // Delete existing conditions
      await tx.promotionConditions.deleteMany({
        where: { promotionId: id },
      });

      // Create new conditions
      if (conditions.length > 0) {
        await tx.promotionConditions.createMany({
          data: conditions.map((condition: any) => ({
            promotionId: id,
            conditionType: condition.conditionType as ConditionType,
            value: condition.value,
            jsonValue: condition.jsonValue || null,
          })),
        });
      }
    }

    // Update product associations if provided
    if (productIds !== undefined) {
      await tx.promotionProduct.deleteMany({
        where: { promotionId: id },
      });

      if (productIds.length > 0) {
        await tx.promotionProduct.createMany({
          data: productIds.map((productId: string) => ({
            promotionId: id,
            productId,
          })),
        });
      }
    }

    // Update category associations if provided
    if (categoryIds !== undefined) {
      await tx.promotionCategory.deleteMany({
        where: { promotionId: id },
      });

      if (categoryIds.length > 0) {
        await tx.promotionCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            promotionId: id,
            categoryId,
          })),
        });
      }
    }

    return updatedPromotion;
  });

  // Get the updated promotion with all relations
  const updatedPromotion = await prisma.promotion.findUnique({
    where: { id },
    include: {
      conditions: true,
      promotionProduct: {
        include: {
          product: true,
        },
      },
      promotionCategory: {
        include: {
          category: true,
        },
      },
    },
  });

  return updatedPromotion;
};

const deleteFromDB = async (id: string): Promise<Promotion> => {
  // Check if promotion exists
  const existingPromotion = await prisma.promotion.findUnique({
    where: { id },
  });

  if (!existingPromotion) {
    throw new ApiError(404, 'Promotion not found');
  }

  // Due to cascade delete setup in the schema, this will also delete:
  // - Associated conditions
  // - Product associations
  // - Category associations
  // - Usage records
  const result = await prisma.promotion.delete({
    where: { id },
  });

  return result;
};

/**
 * Validates if a promotion code is valid and applicable
 * @param payload - Validation payload containing code, user and cart info
 * @returns Promotion details and discount information
 */
const validatePromotion = async (
  payload: IValidatePromotion,
): Promise<IPromotionResponse> => {
  const { code, userId, cartItems = [], cartTotal = 0 } = payload;

  if (!code) {
    throw new ApiError(400, 'Promotion code is required');
  }

  // Find the promotion by code
  const promotion = (await prisma.promotion.findFirst({
    where: {
      code,
      isActive: true,
    },
    include: {
      conditions: true,
      promotionProduct: {
        include: { product: true },
      },
      promotionCategory: {
        include: { category: true },
      },
      promotionUsage: true,
    },
  })) as IPromotionWithRelations;

  if (!promotion) {
    throw new ApiError(
      404,
      'Invalid promotion code or promotion is not active',
    );
  }

  // Check if promotion is active and within date range
  const now = new Date();
  if (promotion.startDate > now || promotion.endDate < now) {
    throw new ApiError(400, 'Promotion is not active at this time');
  }

  // Check usage limits
  if (
    promotion.usageLimit &&
    promotion.promotionUsage &&
    promotion.promotionUsage.length >= promotion.usageLimit
  ) {
    throw new ApiError(400, 'This promotion has reached its usage limit');
  }

  // Check user-specific usage limits
  if (userId && promotion.usageLimitPerUser && promotion.promotionUsage) {
    const userUsageCount = promotion.promotionUsage.filter(
      (usage) => usage.userId === userId,
    ).length;
    if (userUsageCount >= promotion.usageLimitPerUser) {
      throw new ApiError(
        400,
        'You have already used this promotion the maximum number of times',
      );
    }
  }

  // Check minimum purchase requirement
  if (promotion.minPurchase && cartTotal < promotion.minPurchase) {
    throw new ApiError(
      400,
      `This promotion requires a minimum purchase of ${promotion.minPurchase}`,
    );
  }

  // Check condition validations
  await validateConditions(promotion, userId, cartItems, cartTotal);

  // Calculate discount amount
  let discountAmount = calculateDiscountAmount(promotion, cartTotal);

  return {
    promotion,
    discountAmount,
    finalTotal: cartTotal - discountAmount,
  };
};

// Helper function to calculate discount amount
const calculateDiscountAmount = (
  promotion: Promotion & {
    maxDiscount?: number | null;
    usageLimit?: number | null;
    usageLimitPerUser?: number | null;
    minPurchase?: number | null;
  },
  cartTotal: number,
): number => {
  let discountAmount = 0;
  if (promotion.discountType === 'percentage') {
    discountAmount = cartTotal * (promotion.discount / 100);
    if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
      discountAmount = promotion.maxDiscount;
    }
  } else {
    // Fixed amount discount
    discountAmount = promotion.discount;
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal; // Can't discount more than cart total
    }
  }
  return discountAmount;
};

// Helper function to validate promotion conditions
const validateConditions = async (
  promotion: Promotion & {
    conditions?: IPromotionConditionResponse[];
    promotionUsage: any[]; // Changed from usages
    usageLimit?: number | null;
    usageLimitPerUser?: number | null;
    minPurchase?: number | null;
  },
  userId: string | undefined,
  cartItems: ICartItem[],
  cartTotal: number,
) => {
  // Skip if no conditions
  if (!promotion.conditions || promotion.conditions.length === 0) {
    return;
  }

  for (const condition of promotion.conditions) {
    // Use a more robust approach to handle potential enum mismatches
    const conditionTypeStr = condition.conditionType.toString();

    if (conditionTypeStr === 'first_time_purchase') {
      if (userId) {
        const orderCount = await prisma.order.count({
          where: { userId },
        });
        if (orderCount > 0) {
          throw new ApiError(
            400,
            'This promotion is only valid for first-time purchases',
          );
        }
      }
    } else if (conditionTypeStr === 'specific_products') {
      if (cartItems && condition.jsonValue) {
        const requiredProducts = (condition.jsonValue as any).productIds || [];
        const cartProductIds = cartItems.map(
          (item: ICartItem) => item.productId,
        );

        const hasRequiredProduct = requiredProducts.some((productId: string) =>
          cartProductIds.includes(productId),
        );

        if (!hasRequiredProduct) {
          throw new ApiError(
            400,
            "Your cart doesn't contain the products required for this promotion",
          );
        }
      }
    } else if (conditionTypeStr === 'specific_categories') {
      if (cartItems && condition.jsonValue) {
        const requiredCategories =
          (condition.jsonValue as any).categoryIds || [];

        // Get products from cart
        const cartProductIds = cartItems.map(
          (item: ICartItem) => item.productId,
        );
        const productsWithCategories = await prisma.product.findMany({
          where: { id: { in: cartProductIds } },
          select: { categoryId: true },
        });

        const cartCategoryIds = productsWithCategories
          .filter((p) => p.categoryId)
          .map((p) => p.categoryId as string);

        const hasRequiredCategory = requiredCategories.some(
          (categoryId: string) => cartCategoryIds.includes(categoryId),
        );

        if (!hasRequiredCategory) {
          throw new ApiError(
            400,
            "Your cart doesn't contain products from the required categories",
          );
        }
      }
    } else if (conditionTypeStr === 'quantity_threshold') {
      if (cartItems && condition.value) {
        const minQuantity = parseInt(condition.value);
        const totalQuantity = cartItems.reduce(
          (sum: number, item: ICartItem) => sum + item.quantity,
          0,
        );

        if (totalQuantity < minQuantity) {
          throw new ApiError(
            400,
            `This promotion requires at least ${minQuantity} items in your cart`,
          );
        }
      }
    } else if (conditionTypeStr === 'total_items') {
      if (cartItems && condition.value) {
        const requiredItemCount = parseInt(condition.value);
        if (cartItems.length < requiredItemCount) {
          throw new ApiError(
            400,
            `This promotion requires at least ${requiredItemCount} different items in your cart`,
          );
        }
      }
    } else if (conditionTypeStr === 'user_role') {
      if (userId && condition.value) {
        const requiredRole = condition.value;
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        });

        if (!user || user.role !== requiredRole) {
          throw new ApiError(
            400,
            'This promotion is not available for your user role',
          );
        }
      }
    }
    // Handle other condition types as needed
    // You can add more conditions here following the same pattern
  }
};

/**
 * Records the usage of a promotion
 * @param promotionId - The ID of the promotion used
 * @param userId - The ID of the user who used the promotion
 * @param orderId - Optional ID of the associated order
 * @returns The recorded usage
 */
const recordPromotionUsage = async (
  promotionId: string,
  userId: string,
  orderId?: string,
) => {
  // Verify the promotion exists before recording
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
  });

  if (!promotion) {
    throw new ApiError(404, 'Promotion not found');
  }

  const usage = await prisma.promotionUsage.create({
    data: {
      promotionId,
      userId,
      orderId,
    },
  });

  return usage;
};

export const promotionService = {
  insertIntoDB,
  getAllFromDb,
  getPromotionById,
  updateIntoDB,
  deleteFromDB,
  validatePromotion,
  recordPromotionUsage,
};
