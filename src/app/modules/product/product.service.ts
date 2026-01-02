import { Prisma, Product, ProductReview, ProductVariant } from '@prisma/client';
import { IGenericResponse } from '../../../interface/common';
import { IPaginationOptions } from '../../../interface/pagination';
import { paginationHelpers } from '../../../utils/paginationHelper';
import prisma from '../../../utils/prisma';
import {
  IProductFilterRequest,
  productRelationalFields,
  productRelationalFieldsMapper,
  productSearchableFields,
  variantFilterableFields,
  variantSearchableFields,
} from './product.constants';

// New function to check if SKU exists
const checkSkuExists = async (sku: string): Promise<boolean> => {
  const existingVariant = await prisma.productVariant.findUnique({
    where: { sku },
  });

  return !!existingVariant;
};

const insertIntoDB = async (data: any): Promise<Product> => {
  const { variants, ...productData } = data;

  // Ensure images is an array
  if (!productData.images) {
    productData.images = [];
  } else if (!Array.isArray(productData.images)) {
    // Convert single image to array if string is provided
    productData.images = [productData.images];
  }

  // Handle legacy image field if present
  if (productData.image) {
    if (!productData.images) productData.images = [];
    productData.images.push(productData.image);
    delete productData.image; // Remove the old single image field
  }

  // Create product with Prisma transaction if there are variants
  if (variants && variants.length > 0) {
    return await prisma.$transaction(async (tx) => {
      // Create the base product
      const product = await tx.product.create({
        data: {
          ...productData,
          hasVariants: true,
        },
      });

      // Check for duplicate SKUs before creating variants
      for (const variant of variants) {
        const { attributes, images, ...variantData } = variant;

        // Check if SKU already exists
        const existingVariant = await tx.productVariant.findUnique({
          where: { sku: variantData.sku },
        });

        if (existingVariant) {
          throw new Error(`Variant with SKU ${variantData.sku} already exists`);
        }

        // Create the variant with attributes as Json and images as string array
        await tx.productVariant.create({
          data: {
            ...variantData,
            productId: product.id,
            attributes: attributes || {},
            images: images || [],
          },
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          variants: true,
        },
      }) as Promise<Product>;
    });
  } else {
    // Create product without variants
    const result = await prisma.product.create({
      data: productData,
    });
    return result;
  }
};

const getAllProducts = async (
  filters: IProductFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Product[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (productRelationalFields.includes(key)) {
          return {
            [productRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else if (key === 'option1Value') {
          return {
            variants: {
              some: {
                option1Value: (filterData as any)[key],
              },
            },
          };
        } else if (key === 'option2Value') {
          return {
            variants: {
              some: {
                option2Value: (filterData as any)[key],
              },
            },
          };
        } else if (key === 'option3Value') {
          return {
            variants: {
              some: {
                option3Value: (filterData as any)[key],
              },
            },
          };
        } else if (key === 'minPrice') {
          return {
            OR: [
              { price: { gte: (filterData as any)[key] } },
              {
                variants: {
                  some: { price: { gte: (filterData as any)[key] } },
                },
              },
            ],
          };
        } else if (key === 'maxPrice') {
          return {
            OR: [
              { price: { lte: (filterData as any)[key] } },
              {
                variants: {
                  some: { price: { lte: (filterData as any)[key] } },
                },
              },
            ],
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    include: {
      Category: true,
      unit: true,
      variants: {
        where: {
          isActive: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get by category
const getProductsbyCategoryService = async (
  id: string,
  options: IPaginationOptions,
): Promise<IGenericResponse<Product[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const andConditions = [];

  if (id) {
    andConditions.push({
      categoryId: id,
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    include: {
      Category: true,
      unit: true,
      variants: {
        where: {
          isActive: true,
        },
      },
    },
    skip,
    take: Number(limit),
    where: whereConditions,
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    data: result,
  };
};

const getProductById = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      Category: true,
      subCategory: true,
      brand: true,
      unit: true,
      reviews: true,
      questions: true,
      variants: {
        where: { isActive: true },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'asc' }
        ]
      },
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Product>,
): Promise<Product> => {
  // Handle legacy image field if present
  if (payload.hasOwnProperty('image')) {
    const image = (payload as any).image;
    if (!payload.images) payload.images = [];
    if (image) (payload.images as string[]).push(image);
    delete (payload as any).image; // Remove the old field
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
    include: {
      Category: true,
      unit: true,
      variants: {
        where: { isActive: true },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'asc' }
        ]
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Product> => {
  const result = await prisma.product.delete({
    where: {
      id,
    },
    include: {
      Category: true,
    },
  });
  return result;
};

// Product variant methods
const addProductVariant = async (
  productId: string,
  data: any,
): Promise<ProductVariant> => {
  const { attributes, images, ...variantData } = data;

  // Check if SKU already exists
  const skuExists = await checkSkuExists(variantData.sku);
  if (skuExists) {
    throw new Error(`Variant with SKU ${variantData.sku} already exists`);
  }

  const newVariant = await prisma.productVariant.create({
    data: {
      ...variantData,
      productId,
      attributes: attributes || {},
      images: images || [],
    },
  });

  return newVariant;
};

const updateProductVariant = async (
  id: string,
  payload: Partial<ProductVariant>,
): Promise<ProductVariant> => {
  const result = await prisma.productVariant.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteProductVariant = async (id: string): Promise<ProductVariant> => {
  const result = await prisma.productVariant.delete({
    where: {
      id,
    },
  });
  return result;
};

// =================================
// NEW: SHOPIFY-STYLE VARIANT METHODS
// =================================

// 1. Create product with variants (Shopify style)
const createProductWithVariants = async (data: {
  // Basic product info
  name: string;
  description?: string;
  images: string[];
  price?: number;
  comparePrice?: number;
  stockQuantity?: number;
  sku?: string;

  // Variant options
  option1Name?: string; // "Color"
  option2Name?: string; // "Size"
  option3Name?: string; // "Material"

  // Variants array
  variants?: {
    option1Value?: string; // "Red"
    option2Value?: string; // "Large"
    option3Value?: string; // "Cotton"
    sku: string;
    price: number;
    comparePrice?: number;
    stockQuantity: number;
    images?: string[];
    isDefault?: boolean;
  }[];
}): Promise<Product> => {
  return await prisma.$transaction(async (tx) => {
    // Create base product
    const product = await tx.product.create({
      data: {
        name: data.name,
        description: data.description,
        images: data.images || [],
        price: data.price || 0,
        comparePrice: data.comparePrice,
        stockQuantity: data.stockQuantity || 0,
        sku: data.sku,
        option1Name: data.option1Name,
        option2Name: data.option2Name,
        option3Name: data.option3Name,
        hasVariants: (data.variants?.length || 0) > 0,
      }
    });

    // Create variants if provided
    if (data.variants && data.variants.length > 0) {
      // Validate SKU uniqueness
      const skus = data.variants.map(v => v.sku);
      const existingVariants = await tx.productVariant.findMany({
        where: { sku: { in: skus } }
      });

      if (existingVariants.length > 0) {
        throw new Error(`SKUs already exist: ${existingVariants.map(v => v.sku).join(', ')}`);
      }

      // Create variants
      await tx.productVariant.createMany({
        data: data.variants.map((variant, index) => ({
          ...variant,
          productId: product.id,
          isDefault: variant.isDefault || index === 0,
          images: variant.images || [],
        }))
      });
    }

    // Return product with variants
    return await tx.product.findUnique({
      where: { id: product.id },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'asc' }
          ]
        }
      }
    }) as Product;
  });
};

// 2. Get product with variants
const getProductWithVariants = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'asc' }
        ]
      },
      Category: true,
      subCategory: true,
      brand: true,
      unit: true,
    }
  });
  return result;
};

// 3. Bulk create variants for existing product
const createVariantsForProduct = async (productId: string, variants: {
  option1Value?: string;
  option2Value?: string;
  option3Value?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  images?: string[];
  isDefault?: boolean;
}[]): Promise<ProductVariant[]> => {
  return await prisma.$transaction(async (tx) => {
    // Validate product exists
    const product = await tx.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Validate SKU uniqueness
    const skus = variants.map(v => v.sku);
    const existingVariants = await tx.productVariant.findMany({
      where: { sku: { in: skus } }
    });

    if (existingVariants.length > 0) {
      throw new Error(`SKUs already exist: ${existingVariants.map(v => v.sku).join(', ')}`);
    }

    // Create variants
    await tx.productVariant.createMany({
      data: variants.map((variant, index) => ({
        ...variant,
        productId,
        isDefault: variant.isDefault || false,
        images: variant.images || [],
      }))
    });

    // Update product to mark as having variants
    await tx.product.update({
      where: { id: productId },
      data: { hasVariants: true }
    });

    // Fetch and return the created variants
    const createdVariants = await tx.productVariant.findMany({
      where: {
        productId,
        sku: { in: variants.map(v => v.sku) }
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return createdVariants;
  });
};

// 4. Filter products by variant options
const getProductsByVariantOptions = async (
  filters: {
    option1Value?: string;
    option2Value?: string;
    option3Value?: string;
    minPrice?: number;
    maxPrice?: number;
  } & IProductFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { option1Value, option2Value, option3Value, minPrice, maxPrice, ...otherFilters } = filters;

  const whereConditions: any = {
    isActive: true,
  };

  // Variant-based filtering
  if (option1Value || option2Value || option3Value || minPrice || maxPrice) {
    whereConditions.variants = {
      some: {
        isActive: true,
        ...(option1Value && { option1Value }),
        ...(option2Value && { option2Value }),
        ...(option3Value && { option3Value }),
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
      }
    };
  }

  // Add other filters...
  if (otherFilters.categoryId) {
    whereConditions.categoryId = otherFilters.categoryId;
  }

  const result = await prisma.product.findMany({
    where: whereConditions,
    include: {
      variants: {
        where: { isActive: true },
        orderBy: [
          { isDefault: 'desc' },
          { price: 'asc' }
        ]
      },
      Category: true,
      brand: true,
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });

  const total = await prisma.product.count({ where: whereConditions });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

// 5. Auto-generate variant combinations
const generateVariantCombinations = (options: {
  option1Values?: string[];
  option2Values?: string[];
  option3Values?: string[];
}): {
  option1Value?: string;
  option2Value?: string;
  option3Value?: string;
}[] => {
  const { option1Values = [], option2Values = [], option3Values = [] } = options;

  if (option1Values.length === 0) return [];

  const combinations = [];

  for (const opt1 of option1Values) {
    if (option2Values.length === 0) {
      combinations.push({ option1Value: opt1 });
    } else {
      for (const opt2 of option2Values) {
        if (option3Values.length === 0) {
          combinations.push({ option1Value: opt1, option2Value: opt2 });
        } else {
          for (const opt3 of option3Values) {
            combinations.push({
              option1Value: opt1,
              option2Value: opt2,
              option3Value: opt3
            });
          }
        }
      }
    }
  }

  return combinations;
};

// 6. Update existing insertIntoDB to support Shopify-style variants
const insertIntoDBShopify = async (data: any): Promise<Product> => {
  const {
    variants,
    option1Name,
    option2Name,
    option3Name,
    ...productData
  } = data;

  // Ensure images is an array
  if (!productData.images) {
    productData.images = [];
  } else if (!Array.isArray(productData.images)) {
    productData.images = [productData.images];
  }

  // Handle legacy image field if present
  if (productData.image) {
    if (!productData.images) productData.images = [];
    productData.images.push(productData.image);
    delete productData.image;
  }

  // Use new Shopify-style creation if we have variant options
  if ((option1Name || option2Name || option3Name) && variants?.length > 0) {
    return createProductWithVariants({
      ...productData,
      option1Name,
      option2Name,
      option3Name,
      variants
    });
  }

  // Fallback to old method for backward compatibility
  return insertIntoDB(data);
};

export const productService = {
  insertIntoDB,
  getProductById,
  updateIntoDB,
  deleteFromDB,
  getAllProducts,
  getProductsbyCategoryService,
  checkSkuExists,

  // Variant APIs
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,

  // NEW: Shopify-style variant APIs
  createProductWithVariants,
  getProductWithVariants,
  createVariantsForProduct,
  getProductsByVariantOptions,
  generateVariantCombinations,
  insertIntoDBShopify,
};
