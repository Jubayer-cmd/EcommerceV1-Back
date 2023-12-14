import { z } from 'zod';

const createProductReview = z.object({
  body: z.object({
    rating: z.number({
      required_error: 'Rating is required',
    }),
    content: z.string().optional(),
    productId: z.string({
      required_error: 'Product ID is required',
    }),
    userId: z.string({
      required_error: 'User ID is required',
    }),
  }),
});

const updateProductReview = z.object({
  body: z.object({
    rating: z.number().optional(),
    content: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    productId: z.string().optional(),
    userId: z.string().optional(),
  }),
});

export const ProductReviewValidation = {
  createProductReview,
  updateProductReview,
};
