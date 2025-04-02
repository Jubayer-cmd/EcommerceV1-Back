import { z } from 'zod';
import { ConditionType, DiscountType, PromotionType } from '@prisma/client';

const promotionConditionSchema = z.object({
  conditionType: z.nativeEnum(ConditionType),
  value: z.string(),
  jsonValue: z.record(z.unknown()).nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

// Helper function to parse JSON string to array
const parseJsonArray = (val: string | any[] | null | undefined) => {
  if (Array.isArray(val)) return val;
  if (val === null || val === undefined) return [];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Helper function to parse JSON string to conditions array
const parseConditionsArray = (val: string | any[] | null | undefined) => {
  if (Array.isArray(val)) return val;
  if (val === null || val === undefined) return [];
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Helper to parse boolean values from strings
const parseBoolean = (val: string | boolean | undefined | null) => {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return undefined;
};

const createValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    code: z.string({ required_error: 'Code is required' }).trim(),
    image: z.string().optional().nullable(),
    description: z.string().optional(),
    type: z.nativeEnum(PromotionType, {
      required_error: 'Promotion type is required',
    }),
    startDate: z.string({ required_error: 'Start date is required' }),
    endDate: z.string({ required_error: 'End date is required' }),
    // Handle discount as string or number
    discount: z
      .union([
        z.string().transform((val) => {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            throw new Error('Discount must be a valid number');
          }
          return parsed;
        }),
        z.number(),
      ])
      .refine((val) => val > 0, { message: 'Discount must be positive' }),
    discountType: z.nativeEnum(DiscountType, {
      required_error: 'Discount type is required',
    }),
    // Handle other numeric fields
    maxDiscount: z
      .union([
        z.string().transform((val) => parseFloat(val)),
        z.number(),
        z.null(),
      ])
      .nullable()
      .optional(),
    usageLimit: z
      .union([
        z.string().transform((val) => parseInt(val, 10)),
        z.number().int(),
        z.null(),
      ])
      .nullable()
      .optional(),
    usageLimitPerUser: z
      .union([
        z.string().transform((val) => parseInt(val, 10)),
        z.number().int(),
        z.null(),
      ])
      .nullable()
      .optional(),
    minPurchase: z
      .union([
        z.string().transform((val) => parseFloat(val)),
        z.number(),
        z.null(),
      ])
      .nullable()
      .optional(),
    // Handle boolean
    isActive: z
      .union([z.boolean(), z.string().transform((val) => val === 'true')])
      .optional()
      .default(true),
    // Handle arrays
    conditions: z
      .union([
        z.array(promotionConditionSchema),
        z.string().transform(parseConditionsArray),
      ])
      .optional(),
    productIds: z
      .union([z.array(z.string()), z.string().transform(parseJsonArray)])
      .optional(),
    categoryIds: z
      .union([z.array(z.string()), z.string().transform(parseJsonArray)])
      .optional(),
  }),
});

const updateValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().nullable().optional(),
    description: z.string().optional(),
    type: z.nativeEnum(PromotionType).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    // Handle numeric values as strings or numbers
    discount: z
      .union([z.string().transform((val) => parseFloat(val)), z.number()])
      .refine((val) => val > 0, { message: 'Discount must be positive' })
      .optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    maxDiscount: z
      .union([
        z.string().transform((val) => parseFloat(val)),
        z.number(),
        z.literal('null').transform(() => null),
      ])
      .nullable()
      .optional(),
    usageLimit: z
      .union([
        z.string().transform((val) => parseInt(val, 10)),
        z.number().int(),
        z.literal('null').transform(() => null),
      ])
      .nullable()
      .optional(),
    usageLimitPerUser: z
      .union([
        z.string().transform((val) => parseInt(val, 10)),
        z.number().int(),
        z.literal('null').transform(() => null),
      ])
      .nullable()
      .optional(),
    minPurchase: z
      .union([
        z.string().transform((val) => parseFloat(val)),
        z.number(),
        z.literal('null').transform(() => null),
      ])
      .nullable()
      .optional(),
    // Handle boolean values from strings
    isActive: z
      .union([z.boolean(), z.string().transform((val) => val === 'true')])
      .optional(),
    // Handle parsing arrays from JSON strings
    conditions: z
      .union([
        z.array(promotionConditionSchema),
        z.string().transform(parseConditionsArray),
      ])
      .optional(),
    productIds: z
      .union([z.array(z.string()), z.string().transform(parseJsonArray)])
      .optional(),
    categoryIds: z
      .union([z.array(z.string()), z.string().transform(parseJsonArray)])
      .optional(),
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
