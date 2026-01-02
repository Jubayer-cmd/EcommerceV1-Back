import express from 'express';
import { productController } from './Product.controller';

import { ProductValidation } from './product.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

/**
 * @swagger
 * /products/create-product:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               description:
 *                 type: string
 *                 example: "Product Description"
 *               price:
 *                 type: number
 *                 example: 99.99
 *               hasVariants:
 *                 type: boolean
 *                 example: false
 *               unitId:
 *                 type: string
 *                 example: "unit-id-here"
 *     responses:
 *       200:
 *         description: Product created
 */
router.post(
  '/create-product',
  validateRequest(ProductValidation.createProduct),
  productController.insertIntoDB,
);

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productController.getproducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products/{categoryId}/category:
 *   get:
 *     tags: [Products]
 *     summary: Get products by category ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products by category
 */
router.get('/:categoryId/category', productController.getproductsbyCategory);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', productController.deleteFromDB);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Update product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               description:
 *                 type: string
 *                 example: "Updated Product Description"
 *               basePrice:
 *                 type: number
 *                 example: 89.99
 *     responses:
 *       200:
 *         description: Product updated
 */
router.patch(
  '/:id',
  validateRequest(ProductValidation.updateProduct),
  productController.updateIntoDB,
);

/**
 * @swagger
 * /products/{productId}/variants:
 *   post:
 *     tags: [Product Variants]
 *     summary: Add variant to a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *                 example: "PROD-XL-RED"
 *               price:
 *                 type: number
 *                 example: 99.99
 *               stockQuantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Variant added successfully
 */
router.post(
  '/:productId/variants',
  validateRequest(ProductValidation.addProductVariant),
  productController.addProductVariant,
);

/**
 * @swagger
 * /products/variants/{variantId}:
 *   patch:
 *     tags: [Product Variants]
 *     summary: Update product variant
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 89.99
 *               stockQuantity:
 *                 type: number
 *                 example: 45
 *     responses:
 *       200:
 *         description: Variant updated successfully
 */
router.patch(
  '/variants/:variantId',
  validateRequest(ProductValidation.updateProductVariant),
  productController.updateProductVariant,
);

/**
 * @swagger
 * /products/variants/{variantId}:
 *   delete:
 *     tags: [Product Variants]
 *     summary: Delete product variant
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 */
router.delete('/variants/:variantId', productController.deleteProductVariant);

// =================================
// NEW: SHOPIFY-STYLE VARIANT ROUTES
// =================================

/**
 * @swagger
 * /products/with-variants:
 *   post:
 *     tags: [Products]
 *     summary: Create product with variants (Shopify style)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-Shirt"
 *               description:
 *                 type: string
 *                 example: "Premium cotton t-shirt"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["image1.jpg", "image2.jpg"]
 *               option1Name:
 *                 type: string
 *                 example: "Color"
 *               option2Name:
 *                 type: string
 *                 example: "Size"
 *               option3Name:
 *                 type: string
 *                 example: "Material"
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     option1Value:
 *                       type: string
 *                       example: "Red"
 *                     option2Value:
 *                       type: string
 *                       example: "Large"
 *                     option3Value:
 *                       type: string
 *                       example: "Cotton"
 *                     sku:
 *                       type: string
 *                       example: "TSHIRT-RED-L"
 *                     price:
 *                       type: number
 *                       example: 29.99
 *                     comparePrice:
 *                       type: number
 *                       example: 39.99
 *                     stockQuantity:
 *                       type: number
 *                       example: 100
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["variant-image.jpg"]
 *     responses:
 *       201:
 *         description: Product with variants created successfully
 */
router.post('/with-variants', validateRequest(ProductValidation.createProductWithVariants), productController.createProductWithVariants);

/**
 * @swagger
 * /products/{productId}/variants:
 *   get:
 *     tags: [Product Variants]
 *     summary: Get product with all variants
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product with variants fetched successfully
 */
router.get('/:productId/variants', productController.getProductWithVariants);

/**
 * @swagger
 * /products/{productId}/variants/bulk:
 *   post:
 *     tags: [Product Variants]
 *     summary: Create multiple variants for a product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     option1Value:
 *                       type: string
 *                       example: "Blue"
 *                     option2Value:
 *                       type: string
 *                       example: "Medium"
 *                     option3Value:
 *                       type: string
 *                       example: "Polyester"
 *                     sku:
 *                       type: string
 *                       example: "TSHIRT-BLUE-M-POLY"
 *                     price:
 *                       type: number
 *                       example: 24.99
 *                     stockQuantity:
 *                       type: number
 *                       example: 75
 *     responses:
 *       201:
 *         description: Variants created successfully
 */
router.post('/:productId/variants/bulk', validateRequest(ProductValidation.bulkCreateVariants), productController.bulkCreateVariants);

/**
 * @swagger
 * /products/variants/generate-combinations:
 *   post:
 *     tags: [Product Variants]
 *     summary: Generate variant combinations from options
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option1Values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Red", "Blue", "Green"]
 *               option2Values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Small", "Medium", "Large"]
 *               option3Values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Cotton", "Polyester"]
 *     responses:
 *       200:
 *         description: Variant combinations generated successfully
 */
router.post('/variants/generate-combinations', validateRequest(ProductValidation.generateVariantCombinations), productController.generateVariantCombinations);

/**
 * @swagger
 * /products/variant-filters:
 *   get:
 *     tags: [Products]
 *     summary: Get products with variant filtering
 *     parameters:
 *       - in: query
 *         name: option1Value
 *         schema:
 *           type: string
 *         example: "Red"
 *       - in: query
 *         name: option2Value
 *         schema:
 *           type: string
 *         example: "Large"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 20
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 50
 *     responses:
 *       200:
 *         description: Products with variant filters fetched successfully
 */
router.get('/variant-filters', validateRequest(ProductValidation.getProductsByVariantOptions), productController.getProductsWithVariantFilters);

export const productRoutes = router;
