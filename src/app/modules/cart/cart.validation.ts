import { z } from 'zod';

const addToCart = z.object({
  body: z.object({
    productId: z.string({ required_error: 'Product ID is required' }),
    quantity: z
      .number({ required_error: 'Quantity is required' })
      .int()
      .min(1, 'Quantity must be at least 1'),
    productVariantId: z.string().optional(),
  }),
});

export const CartValidation = {
  addToCart,
};
