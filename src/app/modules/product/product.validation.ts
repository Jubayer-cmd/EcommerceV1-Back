import { z } from 'zod';

// Product variant image schema is now a simple string since we're storing as string[]
const productVariantImageSchema = z.string({
  required_error: 'Image URL is required',
});

// Product variant schema updated with attributes as a record/object
const productVariantSchema = z.object({
  sku: z.string({
    required_error: 'SKU is required',
  }),
  name: z.string({
    required_error: 'Variant name is required',
  }),
  price: z.number({
    required_error: 'Variant price is required',
  }),
  comparePrice: z.number().optional(),
  stockQuantity: z.number({
    required_error: 'Stock quantity is required',
  }),
  isDefault: z.boolean().optional().default(false),
  attributes: z.record(z.string(), z.any()).optional(), // Json field for attributes
  images: z.array(z.string()).optional(), // Array of image URLs
});

const createProduct = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z
      .number({
        required_error: 'Price is required',
      })
      .nonnegative('Price must be non-negative'),
    comparePrice: z
      .number()
      .nonnegative('Compare price must be non-negative')
      .optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    subCategoryId: z.string().optional(),
    stockQuantity: z
      .number()
      .nonnegative('Stock quantity must be non-negative')
      .int('Stock quantity must be a whole number')
      .optional(),
    sku: z.string().optional(),
    hasVariants: z.boolean().optional().default(false),
    unitId: z.string().optional(),
    // Only require variants if hasVariants is true
    variants: z
      .array(productVariantSchema)
      .optional()
      .refine(
        (data) => {
          // This refinement will be checked in the controller since it needs access to hasVariants
          return true;
        },
        {
          message: 'Variants are required when hasVariants is true',
        },
      ),
  }),
});

const updateProduct = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number().nonnegative('Price must be non-negative').optional(),
    comparePrice: z
      .number()
      .nonnegative('Compare price must be non-negative')
      .optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    subCategoryId: z.string().optional(),
    stockQuantity: z
      .number()
      .nonnegative('Stock quantity must be non-negative')
      .int('Stock quantity must be a whole number')
      .optional(),
    sku: z.string().optional(),
    hasVariants: z.boolean().optional(),
    unitId: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

// New schema for adding product variant
const addProductVariant = z.object({
  body: productVariantSchema,
});

// New schema for updating product variant
const updateProductVariant = z.object({
  body: z.object({
    name: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().nonnegative('Price must be non-negative').optional(),
    comparePrice: z
      .number()
      .nonnegative('Compare price must be non-negative')
      .optional(),
    stockQuantity: z
      .number()
      .nonnegative('Stock quantity must be non-negative')
      .int('Stock quantity must be a whole number')
      .optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
    attributes: z.record(z.string(), z.any()).optional(),
    images: z.array(z.string()).optional(),
  }),
});

export const ProductValidation = {
  createProduct,
  updateProduct,
  addProductVariant,
  updateProductVariant,
};
