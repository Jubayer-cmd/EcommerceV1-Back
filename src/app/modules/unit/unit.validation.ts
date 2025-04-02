import { z } from 'zod';

const createUnit = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Unit name is required',
    }),
    shortName: z.string({
      required_error: 'Short name is required',
    }),
    description: z.string().optional(),
  }),
});

const updateUnit = z.object({
  body: z.object({
    name: z.string().optional(),
    shortName: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const UnitValidation = {
  createUnit,
  updateUnit,
};
