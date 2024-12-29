import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { bannerController } from './banner.controller';
import { BannerValidation } from './banner.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

/**
 * @swagger
 * /banners/create-banner:
 *   post:
 *     tags: [Banner]
 *     summary: Create a new banner
 *     responses:
 *       200:
 *         description: Banner created
 */
router.post(
  '/create-banner',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BannerValidation.createBanner),
  bannerController.insertIntoDB,
);

/**
 * @swagger
 * /banners:
 *   get:
 *     tags: [Banner]
 *     summary: Get all banners
 *     responses:
 *       200:
 *         description: List of banners
 */
router.get('/', auth(ENUM_USER_ROLE.ADMIN), bannerController.getAllFromDb);

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     tags: [Banner]
 *     summary: Get banner by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner details
 */
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), bannerController.getBannerById);

/**
 * @swagger
 * /banners/{id}:
 *   delete:
 *     tags: [Banner]
 *     summary: Delete banner by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner deleted
 */
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  bannerController.deleteFromDB,
);

/**
 * @swagger
 * /banners/{id}:
 *   patch:
 *     tags: [Banner]
 *     summary: Update banner by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BannerValidation.updateBanner),
  bannerController.updateIntoDB,
);

export const bannerRoutes = router;
