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
 * Maps condition type string to valid ConditionType enum value
 * @param conditionType - The condition type string from input
 * @returns Valid ConditionType enum value
 */
const mapConditionType = (conditionType: string): ConditionType => {
  // Map of input condition types to valid ConditionType enum values
  const conditionTypeMap: Record<string, ConditionType> = {
    first_time_purchase: ConditionType.first_time_purchase,
    specific_products: ConditionType.specific_products,
    specific_categories: ConditionType.specific_categories,
    quantity_threshold: ConditionType.quantity_threshold,
    min_quantity: ConditionType.quantity_threshold, // Map min_quantity to QUANTITY_THRESHOLD
    minimum_purchase_amount: ConditionType.minimum_purchase_amount,
    total_items: ConditionType.total_items,
    user_role: ConditionType.user_role,
    time_of_day: ConditionType.time_of_day,
    day_of_week: ConditionType.day_of_week,
  };

  const mappedType = conditionTypeMap[conditionType.toLowerCase()];
  if (!mappedType) {
    throw new ApiError(400, `Invalid condition type: ${conditionType}`);
  }

  return mappedType;
};

/**
 * Creates a new promotion in the database
 * @param data - The promotion data
 * @returns The created promotion with its relations
 */
const insertIntoDB = async (
  data: ICreatePromotion,
): Promise<IPromotionWithRelations> => {
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
    conditions: rawConditions,
    productIds: rawProductIds,
    categoryIds: rawCategoryIds,
  } = data;

  console.log('Promotion data:', data);
  console.log(typeof discount, discount);

  // Parse JSON strings if needed
  const conditions = parseJsonIfString(rawConditions);
  const productIds = parseJsonIfString(rawProductIds);
  const categoryIds = parseJsonIfString(rawCategoryIds);

  // Force type conversion for ALL numeric fields
  // This ensures Prisma receives the correct types
  const discountFloat =
    typeof discount === 'number' ? discount : parseFloat(String(discount));
  const maxDiscountFloat =
    maxDiscount !== undefined && maxDiscount !== null
      ? parseFloat(String(maxDiscount))
      : null;
  const minPurchaseFloat =
    minPurchase !== undefined && minPurchase !== null
      ? parseFloat(String(minPurchase))
      : null;
  const usageLimitInt =
    usageLimit !== undefined && usageLimit !== null
      ? parseInt(String(usageLimit), 10)
      : null;
  const usageLimitPerUserInt =
    usageLimitPerUser !== undefined && usageLimitPerUser !== null
      ? parseInt(String(usageLimitPerUser), 10)
      : null;

  // Validate all conversions
  if (isNaN(discountFloat))
    throw new ApiError(400, 'Discount must be a valid number');
  if (maxDiscountFloat !== null && isNaN(maxDiscountFloat))
    throw new ApiError(400, 'Max discount must be a valid number');
  if (minPurchaseFloat !== null && isNaN(minPurchaseFloat))
    throw new ApiError(400, 'Min purchase must be a valid number');
  if (usageLimitInt !== null && isNaN(usageLimitInt))
    throw new ApiError(400, 'Usage limit must be a valid number');
  if (usageLimitPerUserInt !== null && isNaN(usageLimitPerUserInt))
    throw new ApiError(400, 'Usage limit per user must be a valid number');

  // Check if a promotion with this code already exists
  const existingPromotion = await prisma.promotion.findFirst({
    where: { code },
  });

  if (existingPromotion) {
    throw new ApiError(400, 'Promotion code already exists');
  }

  // Use a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Create the promotion
    const promotion = await tx.promotion.create({
      data: {
        name,
        code,
        image,
        description,
        type: type as PromotionType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        discount: discountFloat,
        discountType: discountType as DiscountType,
        maxDiscount: maxDiscountFloat, // Use our converted float value
        usageLimit: usageLimitInt, // Use our converted int value
        usageLimitPerUser: usageLimitPerUserInt, // Use our converted int value
        minPurchase: minPurchaseFloat, // Use our converted float value
      },
    });

    // Insert promotion conditions if provided
    if (Array.isArray(conditions) && conditions.length > 0) {
      try {
        await tx.promotionConditions.createMany({
          data: conditions.map((condition) => ({
            promotionId: promotion.id,
            conditionType: mapConditionType(condition.conditionType),
            value: condition.value,
            jsonValue: condition.jsonValue
              ? (condition.jsonValue as any)
              : Prisma.JsonNull,
            isActive:
              condition.isActive !== undefined ? condition.isActive : true,
          })),
        });
      } catch (error) {
        console.error('Error creating promotion conditions:', error);
        throw new ApiError(
          400,
          'Error processing promotion conditions: ' +
            (error instanceof Error ? error.message : 'Unknown error'),
        );
      }
    }

    // Link products if provided
    if (Array.isArray(productIds) && productIds.length > 0) {
      await tx.promotionProduct.createMany({
        data: productIds.map((productId) => ({
          promotionId: promotion.id,
          productId,
        })),
      });
    }

    // Link categories if provided
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await tx.promotionCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          promotionId: promotion.id,
          categoryId,
        })),
      });
    }

    return promotion;
  });

  // Retrieve the newly created promotion with its relations.
  const createdPromotion = await prisma.promotion.findUnique({
    where: { id: result.id },
    include: {
      conditions: true,
      appliedProducts: {
        include: {
          product: true,
        },
      },
      appliedCategories: {
        include: {
          category: true,
        },
      },
      usages: {
        orderBy: { usedAt: 'desc' },
      },
    },
  });

  if (!createdPromotion) {
    throw new ApiError(500, 'Failed to retrieve created promotion');
  }

  return createdPromotion as IPromotionWithRelations;
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
        appliedProducts: {
          include: {
            product: { select: { id: true, name: true, image: true } },
          },
        },
        appliedCategories: {
          include: { category: { select: { id: true, name: true } } },
        },
        _count: {
          select: { usages: true },
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
      appliedProducts: {
        include: { product: true },
      },
      appliedCategories: {
        include: { category: true },
      },
      usages: {
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
    conditions: rawConditions,
    productIds: rawProductIds,
    categoryIds: rawCategoryIds,
  } = payload;

  // Check if promotion exists
  const existingPromotion = await prisma.promotion.findUnique({
    where: { id },
  });

  if (!existingPromotion) {
    throw new ApiError(404, 'Promotion not found');
  }

  // Parse the complex fields that might be JSON strings
  const conditions = parseJsonIfString(rawConditions);
  const productIds = parseJsonIfString(rawProductIds);
  const categoryIds = parseJsonIfString(rawCategoryIds);

  const updateData: any = {};

  // Only include fields that are provided in the payload
  if (name !== undefined) updateData.name = name;
  if (image !== undefined) updateData.image = image;
  if (description !== undefined) updateData.description = description;
  if (type !== undefined) updateData.type = type;
  if (startDate !== undefined) updateData.startDate = new Date(startDate);
  if (endDate !== undefined) updateData.endDate = new Date(endDate);

  // Force type conversion for ALL numeric fields in update too
  if (discount !== undefined) {
    const discountFloat =
      typeof discount === 'number' ? discount : parseFloat(String(discount));
    if (isNaN(discountFloat))
      throw new ApiError(400, 'Discount must be a valid number');
    updateData.discount = discountFloat;
  }

  if (discountType !== undefined) updateData.discountType = discountType;

  if (maxDiscount !== undefined) {
    if (maxDiscount === null) {
      updateData.maxDiscount = null;
    } else {
      const maxDiscountFloat = parseFloat(String(maxDiscount));
      if (isNaN(maxDiscountFloat))
        throw new ApiError(400, 'Max discount must be a valid number');
      updateData.maxDiscount = maxDiscountFloat;
    }
  }

  if (usageLimit !== undefined) {
    if (usageLimit === null) {
      updateData.usageLimit = null;
    } else {
      const usageLimitInt = parseInt(String(usageLimit), 10);
      if (isNaN(usageLimitInt))
        throw new ApiError(400, 'Usage limit must be a valid number');
      updateData.usageLimit = usageLimitInt;
    }
  }

  if (usageLimitPerUser !== undefined) {
    if (usageLimitPerUser === null) {
      updateData.usageLimitPerUser = null;
    } else {
      const usageLimitPerUserInt = parseInt(String(usageLimitPerUser), 10);
      if (isNaN(usageLimitPerUserInt))
        throw new ApiError(400, 'Usage limit per user must be a valid number');
      updateData.usageLimitPerUser = usageLimitPerUserInt;
    }
  }

  if (minPurchase !== undefined) {
    if (minPurchase === null) {
      updateData.minPurchase = null;
    } else {
      const minPurchaseFloat = parseFloat(String(minPurchase));
      if (isNaN(minPurchaseFloat))
        throw new ApiError(400, 'Min purchase must be a valid number');
      updateData.minPurchase = minPurchaseFloat;
    }
  }

  if (isActive !== undefined) updateData.isActive = isActive === true;

  const result = await prisma.$transaction(async (tx) => {
    // Update promotion
    const updatedPromotion = await tx.promotion.update({
      where: { id },
      data: updateData,
    });

    // Update conditions if provided
    if (rawConditions !== undefined) {
      // Delete existing conditions
      await tx.promotionConditions.deleteMany({
        where: { promotionId: id },
      });

      // Create new conditions - ensure conditions is an array before mapping
      if (Array.isArray(conditions) && conditions.length > 0) {
        try {
          await tx.promotionConditions.createMany({
            data: conditions.map((condition: any) => ({
              promotionId: id,
              conditionType: mapConditionType(condition.conditionType),
              value: condition.value,
              jsonValue: condition.jsonValue || null,
              isActive:
                condition.isActive !== undefined ? condition.isActive : true,
            })),
          });
        } catch (error) {
          console.error('Error creating promotion conditions:', error);
          throw new ApiError(
            400,
            'Error processing promotion conditions: ' +
              (error instanceof Error ? error.message : 'Unknown error'),
          );
        }
      }
    }

    // Update product associations if provided
    if (rawProductIds !== undefined) {
      await tx.promotionProduct.deleteMany({
        where: { promotionId: id },
      });

      if (Array.isArray(productIds) && productIds.length > 0) {
        await tx.promotionProduct.createMany({
          data: productIds.map((productId: string) => ({
            promotionId: id,
            productId,
          })),
        });
      }
    }

    // Update category associations if provided
    if (rawCategoryIds !== undefined) {
      await tx.promotionCategory.deleteMany({
        where: { promotionId: id },
      });

      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
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
      appliedProducts: {
        include: {
          product: true,
        },
      },
      appliedCategories: {
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
      appliedProducts: {
        include: { product: true },
      },
      appliedCategories: {
        include: { category: true },
      },
      usages: true,
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
    promotion.usages &&
    promotion.usages.length >= promotion.usageLimit
  ) {
    throw new ApiError(400, 'This promotion has reached its usage limit');
  }

  // Check user-specific usage limits
  if (userId && promotion.usageLimitPerUser && promotion.usages) {
    const userUsageCount = promotion.usages.filter(
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
    usages?: any[]; // Changed from required to optional
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
    // Map the condition type string to enum if needed
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

// Helper function to parse JSON strings
const parseJsonIfString = (value: any): any => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Error parsing JSON string:', error);
      // If it's supposed to be an array but parsing failed, return empty array
      if (value.trim().startsWith('[') || value.trim() === '') {
        return [];
      }
      // Return original value if parsing fails
      return value;
    }
  }
  return value;
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
