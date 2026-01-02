import express from 'express';
import { productController } from './Product.controller';

import { ProductValidation } from './product.validation';
import validateRequest from '../../middleware/validateRequest';
import parseProductFormData from '../../middleware/parseProductFormData';

const router = express.Router();

// =================================
// SPECIFIC ROUTES FIRST (before parameterized routes)
// =================================

// Product creation routes
router.post(
  '/create-product',
  parseProductFormData,
  validateRequest(ProductValidation.createProduct),
  productController.insertIntoDB,
);

router.post(
  '/with-variants',
  parseProductFormData,
  validateRequest(ProductValidation.createProductWithVariants),
  productController.createProductWithVariants,
);

// Variant utility routes
router.get(
  '/variant-filters',
  validateRequest(ProductValidation.getProductsByVariantOptions),
  productController.getProductsWithVariantFilters,
);

router.post(
  '/variants/generate-combinations',
  validateRequest(ProductValidation.generateVariantCombinations),
  productController.generateVariantCombinations,
);

router.patch(
  '/variants/:variantId',
  parseProductFormData,
  validateRequest(ProductValidation.updateProductVariant),
  productController.updateProductVariant,
);

router.delete('/variants/:variantId', productController.deleteProductVariant);

// List all products
router.get('/', productController.getproducts);

// =================================
// PARAMETERIZED ROUTES LAST
// =================================

router.get('/:id', productController.getProductById);

router.get('/:categoryId/category', productController.getproductsbyCategory);

router.patch(
  '/:id',
  parseProductFormData,
  validateRequest(ProductValidation.updateProduct),
  productController.updateIntoDB,
);

router.delete('/:id', productController.deleteFromDB);

router.post(
  '/:productId/variants',
  parseProductFormData,
  validateRequest(ProductValidation.addProductVariant),
  productController.addProductVariant,
);

router.get('/:productId/variants', productController.getProductWithVariants);

router.post(
  '/:productId/variants/bulk',
  parseProductFormData,
  validateRequest(ProductValidation.bulkCreateVariants),
  productController.bulkCreateVariants,
);

export const productRoutes = router;
