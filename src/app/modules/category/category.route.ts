import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { categoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

/**
 * @swagger
 * /categories/create-category:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Category Name"
 *               description:
 *                 type: string
 *                 example: "Category Description"
 *     responses:
 *       200:
 *         description: Category created
 */
router.post(
  '/categories/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.createCategory),
  categoryController.insertIntoDB,
);

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get(
  '/categories',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.getAllFromDb,
);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get('/categories/:id', categoryController.getUserById);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete(
  '/categories/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.deleteFromDB,
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Update category by ID
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
 *                 example: "Updated Category Name"
 *               description:
 *                 type: string
 *                 example: "Updated Category Description"
 *     responses:
 *       200:
 *         description: Category updated
 */
router.patch(
  '/categories/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.updateCategory),
  categoryController.updateIntoDB,
);

export const categoryRoutes = router;
