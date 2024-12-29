import express from 'express';
import { wishlistController } from './wishlist.controller';

const router = express.Router();

/**
 * @swagger
 * /wishlist/{id}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add a product to the wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 */
router.post('/:id', wishlistController.insertIntoDB);

/**
 * @swagger
 * /wishlist/{id}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get wishlist by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist details
 */
router.get('/:id', wishlistController.getUserById);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Delete wishlist by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist deleted
 */
router.delete('/:id', wishlistController.deleteFromDB);

export const wishlistRoutes = router;
