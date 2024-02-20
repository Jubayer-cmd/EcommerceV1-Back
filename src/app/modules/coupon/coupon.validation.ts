import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    code: z.string({
      required_error: 'Code is required',
    }),
    discount: z.number({
        required_error: 'Discount is required',
        }),
        discountType: z.enum(['percentage', 'fixed_amount'], {
            required_error: 'Discount type is required',
        }),
        minPurchase: z.number().optional(),
        maxDiscount: z.number().optional(),
        startDate: z.string({
            required_error: 'Start date is required',
        }),
        expireDate: z.string({
            required_error: 'Expire date is required',
        }),
        status: z.boolean({
            required_error: 'Status is required',
        }),
        couponType: z.enum(['default', 'first_order']).optional(),
    }),
});

const updateValidation = z.object({
    body: z.object({
        title: z.string().optional(),
        code: z.string().optional(),
        discount: z.number().optional(),
        discountType: z.enum(['percentage', 'fixed_amount']).optional(),
        minPurchase: z.number().optional(),
        maxDiscount: z.number().optional(),
        startDate: z.string().optional(),
        expireDate: z.string().optional(),
        status: z.boolean().optional(),
        couponType: z.enum(['default', 'first_order']).optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    }),
    });

export const CouponValidation = {
    createValidation,
    updateValidation
}
  