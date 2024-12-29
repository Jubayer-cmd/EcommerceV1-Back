import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { brandController } from './brand.controller';
import { BrandValidation } from './brand.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

/**
 * @swagger
 * /create-brand:
 *   post:
 *     tags: [Brands]
 *     summary: Create a new brand
 *     responses:
 *       200:
 *         description: Brand created
 */
router.post(
  '/create-brand',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BrandValidation.createBrand),
  brandController.insertIntoDB,
);

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Brands]
 *     summary: Get all brands
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/', auth(ENUM_USER_ROLE.ADMIN), brandController.getAllFromDb);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags: [Brands]
 *     summary: Get brand by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Brand fetched
 */
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), brandController.getUserById);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     tags: [Brands]
 *     summary: Delete a brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Brand deleted
 */
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), brandController.deleteFromDB);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     tags: [Brands]
 *     summary: Update a brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Brand updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BrandValidation.updateBrand),
  brandController.updateIntoDB,
);

export const brandRoutes = router;
