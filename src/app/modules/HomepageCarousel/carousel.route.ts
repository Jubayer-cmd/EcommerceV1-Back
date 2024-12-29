import express from 'express';
import { carouselController } from './carousel.controller';
import { compressAndResizeMultipleImages } from '../../middleware/upload-file';

const router = express.Router();

/**
 * @swagger
 * /carousel:
 *   post:
 *     tags: [Carousel]
 *     summary: Add a new carousel item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Carousel Title"
 *               image:
 *                 type: string
 *                 example: "Image URL"
 *     responses:
 *       200:
 *         description: Carousel item added
 */
router.post(
  '/',
  compressAndResizeMultipleImages,
  carouselController.insertIntoDB,
);

/**
 * @swagger
 * /carousel:
 *   get:
 *     tags: [Carousel]
 *     summary: Get all carousel items
 *     responses:
 *       200:
 *         description: List of carousel items
 */
router.get('/', carouselController.getcarousel);

/**
 * @swagger
 * /carousel/{id}:
 *   get:
 *     tags: [Carousel]
 *     summary: Get carousel item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carousel item details
 */
router.get('/:id', carouselController.getcarouselById);

/**
 * @swagger
 * /carousel/{id}:
 *   delete:
 *     tags: [Carousel]
 *     summary: Delete carousel item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carousel item deleted
 */
router.delete('/:id', carouselController.deleteFromDB);

export const carouselRoutes = router;
