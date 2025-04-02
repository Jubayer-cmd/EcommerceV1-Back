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
 *               basePrice:
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
  // validateRequest(ProductValidation.createProduct),
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

export const productRoutes = router;
