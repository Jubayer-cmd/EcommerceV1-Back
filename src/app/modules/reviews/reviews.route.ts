import express from "express";
import { reviewsController } from "./reviews.controller";

const router = express.Router();

/**
 * @swagger
 * /reviews/create-reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               content:
 *                 type: string
 *                 example: "Great product!"
 *     responses:
 *       200:
 *         description: Review created
 */
router.post("/reviews/create-reviews", reviewsController.insertIntoDB);

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/reviews", reviewsController.getreviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 */
router.get("/reviews/:id", reviewsController.getreviewsById);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete("/reviews/:id", reviewsController.deleteFromDB);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update review by ID
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
 *               rating:
 *                 type: number
 *                 example: 4
 *               content:
 *                 type: string
 *                 example: "Updated review content"
 *     responses:
 *       200:
 *         description: Review updated
 */
router.patch("/reviews/:id", reviewsController.updateIntoDB);

export const reviewsRoutes = router;
