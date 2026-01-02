import express from 'express';
import { productController } from './Product.controller';

import { ProductValidation } from './product.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/create-product',
  validateRequest(ProductValidation.createProduct),
  productController.insertIntoDB,
);

router.get('/', productController.getproducts);

router.get('/:id', productController.getProductById);

router.get('/:categoryId/category', productController.getproductsbyCategory);

router.delete('/:id', productController.deleteFromDB);

router.patch(
  '/:id',
  validateRequest(ProductValidation.updateProduct),
  productController.updateIntoDB,
);

router.post(
  '/:productId/variants',
  validateRequest(ProductValidation.addProductVariant),
  productController.addProductVariant,
);

router.patch(
  '/variants/:variantId',
  validateRequest(ProductValidation.updateProductVariant),
  productController.updateProductVariant,
);

router.delete('/variants/:variantId', productController.deleteProductVariant);

// =================================
// NEW: SHOPIFY-STYLE VARIANT ROUTES
// =================================

router.post('/with-variants', validateRequest(ProductValidation.createProductWithVariants), productController.createProductWithVariants);

router.get('/:productId/variants', productController.getProductWithVariants);

router.post('/:productId/variants/bulk', validateRequest(ProductValidation.bulkCreateVariants), productController.bulkCreateVariants);

router.post('/variants/generate-combinations', validateRequest(ProductValidation.generateVariantCombinations), productController.generateVariantCombinations);

router.get('/variant-filters', validateRequest(ProductValidation.getProductsByVariantOptions), productController.getProductsWithVariantFilters);

export const productRoutes = router;
