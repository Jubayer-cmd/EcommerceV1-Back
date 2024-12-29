import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { questionController } from './proQues.controller';
import { ProductQuestionValidation } from './proQues.validation';

const router = express.Router();

/**
 * @swagger
 * /product-questions:
 *   post:
 *     tags: [Product Questions]
 *     summary: Create a new product question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is the warranty period?"
 *     responses:
 *       200:
 *         description: Product question created
 */
router.post(
  '/',
  validateRequest(ProductQuestionValidation.createProductQuestion),
  questionController.insertIntoDB,
);

/**
 * @swagger
 * /product-questions:
 *   get:
 *     tags: [Product Questions]
 *     summary: Get all product questions
 *     responses:
 *       200:
 *         description: List of product questions
 */
router.get('/', questionController.getAllFromDb);

/**
 * @swagger
 * /product-questions/{id}:
 *   get:
 *     tags: [Product Questions]
 *     summary: Get product question by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product question details
 */
router.get('/:id', questionController.getUserById);

/**
 * @swagger
 * /product-questions/{id}:
 *   delete:
 *     tags: [Product Questions]
 *     summary: Delete product question by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product question deleted
 */
router.delete('/:id', questionController.deleteFromDB);

/**
 * @swagger
 * /product-questions/{id}:
 *   patch:
 *     tags: [Product Questions]
 *     summary: Update product question by ID
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
 *               question:
 *                 type: string
 *                 example: "Updated question"
 *               answer:
 *                 type: string
 *                 example: "Updated answer"
 *     responses:
 *       200:
 *         description: Product question updated
 */
router.patch(
  '/:id',
  validateRequest(ProductQuestionValidation.updateProductQuestion),
  questionController.updateIntoDB,
);

export const questionRoutes = router;
