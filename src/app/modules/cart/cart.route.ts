import express from 'express';
import { cartController } from './cart.controller';

const router = express.Router();

/**
 * @swagger
 * /cart/add-to-cart/{id}:
 *   post:
 *     tags: [Cart]
 *     summary: Add a product to the cart
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
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 */
router.post('/add-to-cart/:id', cartController.insertIntoDB);

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     tags: [Cart]
 *     summary: Get cart by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get('/:id', cartController.getUserById);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Delete cart by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart deleted
 */
router.delete('/:id', cartController.deleteFromDB);

export const cartRoutes = router;
