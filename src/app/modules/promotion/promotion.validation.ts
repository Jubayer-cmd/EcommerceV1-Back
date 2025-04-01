import { z } from 'zod';
import { ConditionType, DiscountType, PromotionType } from '@prisma/client';

const promotionConditionSchema = z.object({
  conditionType: z.nativeEnum(ConditionType),
  value: z.string(),
  jsonValue: z.any().optional(),
});

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    code: z.string({ required_error: 'Code is required' }).trim(),
    image: z.string().optional(),
    description: z.string().optional(),
    type: z.nativeEnum(PromotionType, {
      required_error: 'Promotion type is required',
    }),
    startDate: z.string({ required_error: 'Start date is required' }),
    endDate: z.string({ required_error: 'End date is required' }),
    discount: z.number({ required_error: 'Discount is required' }).positive(),
    discountType: z.nativeEnum(DiscountType, {
      required_error: 'Discount type is required',
    }),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    usageLimitPerUser: z.number().int().positive().optional(),
    minPurchase: z.number().positive().optional(),
    isActive: z.boolean().optional(),
    conditions: z.array(promotionConditionSchema).optional(),
    productIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
  }),
});

const updateValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    type: z.nativeEnum(PromotionType).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    discount: z.number().positive().optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    usageLimitPerUser: z.number().int().positive().optional(),
    minPurchase: z.number().positive().optional(),
    isActive: z.boolean().optional(),
    conditions: z.array(promotionConditionSchema).optional(),
    productIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
  }),
});

const validatePromotionSchema = z.object({
  body: z.object({
    code: z.string({ required_error: 'Promotion code is required' }).trim(),
    userId: z.string().optional(),
    cartItems: z
      .array(
        z.object({
          productId: z.string(),
          quantity: z.number().int().positive(),
          price: z.number().positive().optional(),
        }),
      )
      .optional(),
    cartTotal: z.number().nonnegative().optional(),
  }),
});

const recordUsageSchema = z.object({
  body: z.object({
    promotionId: z.string({ required_error: 'Promotion ID is required' }),
    userId: z.string({ required_error: 'User ID is required' }),
    orderId: z.string().optional(),
  }),
});

export const PromotionValidation = {
  createValidation,
  updateValidation,
  validatePromotionSchema,
  recordUsageSchema,
};
