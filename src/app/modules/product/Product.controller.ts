import { Product } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { productFilterableFields } from './product.constants';
import { productService } from './product.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  // Form data parsing is now handled by parseProductFormData middleware

  // Validation: if hasVariants is true, variants must be present
  if (
    req.body.hasVariants &&
    (!req.body.variants || !req.body.variants.length)
  ) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Variants are required when hasVariants is true',
    });
  }

  try {
    const result = await productService.insertIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'product created successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message && error.message.includes('already exists')) {
      return sendResponse(res, {
        statusCode: httpStatus.CONFLICT,
        success: false,
        message: error.message,
      });
    }
    throw error;
  }
});

const getproducts: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, productFilterableFields);
    const result = await productService.getAllProducts(filters, options);

    sendResponse<Product[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Products fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getproductsbyCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const options = pick(req.query, ['limit', 'page']);
    const result = await productService.getProductsbyCategoryService(
      categoryId,
      options,
    );

    sendResponse<Product[]>(res, {
      statusCode: 200,
      success: true,
      message: 'products with associated category data fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProductById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'product fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'product deleted successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  // Form data parsing is now handled by parseProductFormData middleware
  const result = await productService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'product updated successfully',
    data: result,
  });
});

// Product variant controllers
const addProductVariant = catchAsync(async (req: Request, res: Response) => {
  // Form data parsing is now handled by parseProductFormData middleware
  const { productId } = req.params;

  try {
    const result = await productService.addProductVariant(productId, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'product variant added successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message && error.message.includes('already exists')) {
      return sendResponse(res, {
        statusCode: httpStatus.CONFLICT,
        success: false,
        message: error.message,
      });
    }
    throw error;
  }
});

const updateProductVariant = catchAsync(async (req: Request, res: Response) => {
  // Form data parsing is now handled by parseProductFormData middleware
  const { variantId } = req.params;
  const result = await productService.updateProductVariant(variantId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'product variant updated successfully',
    data: result,
  });
});

const deleteProductVariant = catchAsync(async (req: Request, res: Response) => {
  const { variantId } = req.params;
  const result = await productService.deleteProductVariant(variantId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'product variant deleted successfully',
    data: result,
  });
});

// =================================
// NEW: SHOPIFY-STYLE VARIANT CONTROLLERS
// =================================

const createProductWithVariants = catchAsync(async (req: Request, res: Response) => {
  // Form data parsing is now handled by parseProductFormData middleware
  const result = await productService.createProductWithVariants(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product with variants created successfully',
    data: result,
  });
});

const getProductWithVariants = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await productService.getProductWithVariants(productId);

  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product with variants fetched successfully',
    data: result,
  });
});

const bulkCreateVariants = catchAsync(async (req: Request, res: Response) => {
  // Form data parsing is now handled by parseProductFormData middleware
  const { productId } = req.params;
  const result = await productService.createVariantsForProduct(productId, req.body.variants);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Variants created successfully',
    data: result,
  });
});

const generateVariantCombinations = catchAsync(async (req: Request, res: Response) => {
  const combinations = productService.generateVariantCombinations(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Variant combinations generated successfully',
    data: combinations,
  });
});

const getProductsWithVariantFilters = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, [
    'searchTerm',
    'categoryId',
    'brandId',
    'subCategoryId',
    'minPrice',
    'maxPrice',
    'option1Value',
    'option2Value',
    'option3Value',
  ]);

  const result = await productService.getProductsByVariantOptions(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products with variant filters fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const productController = {
  insertIntoDB,
  getProductById,
  updateIntoDB,
  deleteFromDB,
  getproducts,
  getproductsbyCategory,

  // Variant controllers
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,

  // NEW: Shopify-style variant controllers
  createProductWithVariants,
  getProductWithVariants,
  bulkCreateVariants,
  generateVariantCombinations,
  getProductsWithVariantFilters,
};
