import { z } from 'zod';

// Product variant image schema
const productVariantImageSchema = z.object({
  url: z.string({
    required_error: 'Image URL is required',
  }),
  isDefault: z.boolean().optional().default(false),
});

// Product variant schema
const productVariantSchema = z.object({
  sku: z.string({
    required_error: 'SKU is required',
  }),
  price: z.number({
    required_error: 'Variant price is required',
  }),
  comparePrice: z.number().optional(),
  stockQuantity: z.number({
    required_error: 'Stock quantity is required',
  }),
  isDefault: z.boolean().optional().default(false),
  attributes: z.array(
    z.object({
      attributeValueId: z.string({
        required_error: 'Attribute value ID is required',
      }),
    }),
  ),
  images: z.array(productVariantImageSchema).optional(),
});

const createProduct = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    description: z.string().optional(),
    image: z.string().optional(),
    basePrice: z.number({
      required_error: 'Base price is required',
    }),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    subCategoryId: z.string().optional(),
    stock: z.string().optional(),
    quantity: z.number(),
    hasVariants: z.boolean().optional().default(false),
    unitId: z.string().optional(),
    // Only require variants if hasVariants is true
    variants: z.array(productVariantSchema).optional(),
  }),
});

const updateProduct = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    basePrice: z.number().optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    subCategoryId: z.string().optional(),
    stock: z.string().optional(),
    quantity: z.number().optional(),
    hasVariants: z.boolean().optional(),
    unitId: z.string().optional(),
  }),
});

// New schema for adding product variant
const addProductVariant = z.object({
  body: productVariantSchema,
});

// New schema for updating product variant
const updateProductVariant = z.object({
  body: z.object({
    sku: z.string().optional(),
    price: z.number().optional(),
    comparePrice: z.number().optional(),
    stockQuantity: z.number().optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  createProduct,
  updateProduct,
  addProductVariant,
  updateProductVariant,
};
