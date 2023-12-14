import { z } from 'zod';

const createProductQuestion = z.object({
  body: z.object({
    question: z.string({
      required_error: 'Question is required',
    }),
    answer: z.string().optional(),
  }),
});

const updateProductQuestion = z.object({
  body: z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    productId: z.string().optional(),
    userId: z.string().optional(),
  }),
});

export const ProductQuestionValidation = {
  createProductQuestion,
  updateProductQuestion,
};
