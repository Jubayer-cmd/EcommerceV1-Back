import express from "express";
import { productController } from "./Product.controller";

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
 *     responses:
 *       200:
 *         description: Product created
 */
router.post("/products/create-product", productController.insertIntoDB);

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
router.get("/products", productController.getproducts);

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
router.get("/products/:id", productController.getProductById);

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
router.get(
  "/products/:categoryId/category",
  productController.getproductsbyCategory
);

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
router.delete("/products/:id", productController.deleteFromDB);

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
 *               price:
 *                 type: number
 *                 example: 89.99
 *     responses:
 *       200:
 *         description: Product updated
 */
router.patch("/products/:id", productController.updateIntoDB);

export const productRoutes = router;
