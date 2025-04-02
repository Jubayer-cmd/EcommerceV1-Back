import { z } from 'zod';

// Simplified attribute schema
const createAttribute = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Attribute name is required',
    }),
    description: z.string().optional(),
  }),
});

const updateAttribute = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

// Simple attribute value schema
const createAttributeValue = z.object({
  body: z.object({
    value: z.string({
      required_error: 'Value is required',
    }),
  }),
});

const updateAttributeValue = z.object({
  body: z.object({
    value: z.string({
      required_error: 'Value is required',
    }),
  }),
});

export const AttributeValidation = {
  createAttribute,
  updateAttribute,
  createAttributeValue,
  updateAttributeValue,
};
