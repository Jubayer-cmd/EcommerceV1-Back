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

const insertIntoDB = async (data: any): Promise<Product> => {
  const { variants, ...productData } = data;

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

      // Create each variant with proper structure according to schema
      for (const variant of variants) {
        const { attributes, images, ...variantData } = variant;

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
        } else if (key === 'attributeValue') {
          // Filter by attribute value using Json field
          return {
            variants: {
              some: {
                attributes: {
                  path: ['$[*]'],
                  string_contains: (filterData as any)[key],
                },
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
        include: {
          attributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
          images: true,
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
        include: {
          attributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
          images: true,
        },
      },
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Product>,
): Promise<Product> => {
  const result = await prisma.product.update({
    where: {
      id,
    },
    data: payload,
    include: {
      Category: true,
      unit: true,
      variants: {
        include: {
          attributes: {
            include: {
              attributeValue: true,
            },
          },
          images: true,
        },
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

export const productService = {
  insertIntoDB,
  getProductById,
  updateIntoDB,
  deleteFromDB,
  getAllProducts,
  getProductsbyCategoryService,

  // Variant APIs
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
};
