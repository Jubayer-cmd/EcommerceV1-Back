import { z } from 'zod';

const createSubCategory = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string().optional(),
    categoryId: z.string({
      required_error: 'Category ID is required',
    }),
  }),
});

const updateSubCategory = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const SubCategoryValidation = {
  createSubCategory,
  updateSubCategory,
};
