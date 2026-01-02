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
    // Replace image field with images array
    images: z.array(z.string()).optional().default([]),
    // Keep image field for backwards compatibility
    image: z.string().nullable().optional(),
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
    // Replace image field with images array
    images: z.array(z.string()).optional(),
    // Keep image field for backwards compatibility
    image: z.string().nullable().optional(),
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

// =================================
// NEW: SHOPIFY-STYLE VARIANT VALIDATION
// =================================

// New product variant schema for Shopify-style variants
const shopifyProductVariantSchema = z.object({
  option1Value: z.string().optional(),
  option2Value: z.string().optional(),
  option3Value: z.string().optional(),
  sku: z.string({
    required_error: 'SKU is required',
  }),
  price: z.number({
    required_error: 'Price is required',
  }).min(0, 'Price must be non-negative'),
  comparePrice: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0).optional().default(0),
  isDefault: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
});

// New schema for creating product with Shopify-style variants
const createProductWithVariants = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product name is required',
    }),
    description: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    price: z.number().min(0).optional().default(0),
    comparePrice: z.number().min(0).optional(),
    stockQuantity: z.number().int().min(0).optional().default(0),
    sku: z.string().optional(),

    // Variant options (Shopify-style)
    option1Name: z.string().optional(),
    option2Name: z.string().optional(),
    option3Name: z.string().optional(),

    // Variants array
    variants: z.array(shopifyProductVariantSchema).optional().default([]),

    // Relations
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    brandId: z.string().optional(),
    unitId: z.string().optional(),
  }),
});

// Schema for bulk creating variants
const bulkCreateVariants = z.object({
  body: z.object({
    variants: z.array(shopifyProductVariantSchema).min(1, 'At least one variant is required'),
  }),
});

// Schema for generating variant combinations
const generateVariantCombinations = z.object({
  body: z.object({
    option1Values: z.array(z.string()).optional().default([]),
    option2Values: z.array(z.string()).optional().default([]),
    option3Values: z.array(z.string()).optional().default([]),
  }),
});

// Schema for filtering products by variant options
const getProductsByVariantOptions = z.object({
  query: z.object({
    option1Value: z.string().optional(),
    option2Value: z.string().optional(),
    option3Value: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    subCategoryId: z.string().optional(),
    searchTerm: z.string().optional(),
  }),
});

// Updated variant schema for backward compatibility
const updatedProductVariantSchema = z.object({
  sku: z.string({
    required_error: 'SKU is required',
  }),
  price: z.number({
    required_error: 'Variant price is required',
  }).min(0, 'Price must be non-negative'),
  comparePrice: z.number().min(0).optional(),
  stockQuantity: z.number({
    required_error: 'Stock quantity is required',
  }).int().min(0),
  isDefault: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),

  // Support both old and new variant formats
  option1Value: z.string().optional(),
  option2Value: z.string().optional(),
  option3Value: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(), // Keep for backward compatibility
});

export const ProductValidation = {
  createProduct,
  updateProduct,
  addProductVariant,
  updateProductVariant,

  // NEW: Shopify-style validation
  createProductWithVariants,
  bulkCreateVariants,
  generateVariantCombinations,
  getProductsByVariantOptions,

  // Updated schemas
  shopifyProductVariantSchema,
  updatedProductVariantSchema,
};
