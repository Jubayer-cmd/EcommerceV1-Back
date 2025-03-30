import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { subCategoryController } from './subCategory.controller';
import { SubCategoryValidation } from './subCategory.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

/**
 * @swagger
 * /sub-category/create-subCategory:
 *   post:
 *     tags: [SubCategory]
 *     summary: Create a new sub-category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       200:
 *         description: Sub-category created
 */
router.post(
  '/create-subCategory',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SubCategoryValidation.createSubCategory),
  subCategoryController.insertIntoDB,
);

/**
 * @swagger
 * /sub-category/subCategories:
 *   get:
 *     tags: [SubCategory]
 *     summary: Get all sub-categories
 *     responses:
 *       200:
 *         description: List of sub-categories
 */
router.get('/', auth(ENUM_USER_ROLE.ADMIN), subCategoryController.getAllFromDb);

/**
 * @swagger
 * /sub-category/subCategories/{id}:
 *   get:
 *     tags: [SubCategory]
 *     summary: Get sub-category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sub-category details
 */
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  subCategoryController.getSubCategoryById,
);

/**
 * @swagger
 * /sub-category/subCategories/{id}:
 *   delete:
 *     tags: [SubCategory]
 *     summary: Delete sub-category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sub-category deleted
 */
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  subCategoryController.deleteFromDB,
);

/**
 * @swagger
 * /sub-category/subCategories/{id}:
 *   patch:
 *     tags: [SubCategory]
 *     summary: Update sub-category by ID
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
 *             $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       200:
 *         description: Sub-category updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SubCategoryValidation.updateSubCategory),
  subCategoryController.updateIntoDB,
);

export const subCategoryRoutes = router;
