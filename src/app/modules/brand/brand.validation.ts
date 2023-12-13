import { z } from 'zod';

const createBrand = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string().optional(),
  }),
});

const updateBrand = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const BrandValidation = {
  createBrand,
  updateBrand,
};
