import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { couponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

/**
 * @swagger
 * /coupons/create-coupon:
 *   post:
 *     tags: [Coupons]
 *     summary: Create a new coupon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Coupon Title"
 *               code:
 *                 type: string
 *                 example: "COUPONCODE"
 *               discount:
 *                 type: number
 *                 example: 10
 *               discountType:
 *                 type: string
 *                 example: "percentage"
 *               minPurchase:
 *                 type: number
 *                 example: 50
 *               maxDiscount:
 *                 type: number
 *                 example: 100
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-01-01T00:00:00.000Z"
 *               expireDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: Coupon created
 */
router.post(
  '/create-coupon',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CouponValidation.createValidation),
  couponController.insertIntoDB,
);

/**
 * @swagger
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: Get all coupons
 *     responses:
 *       200:
 *         description: List of coupons
 */
router.get('/', auth(ENUM_USER_ROLE.ADMIN), couponController.getAllFromDb);

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     tags: [Coupons]
 *     summary: Get coupon by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon details
 */
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), couponController.getCouponById);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     tags: [Coupons]
 *     summary: Delete coupon by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon deleted
 */
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  couponController.deleteFromDB,
);

/**
 * @swagger
 * /coupons/{id}:
 *   patch:
 *     tags: [Coupons]
 *     summary: Update coupon by ID
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
 *               title:
 *                 type: string
 *                 example: "Updated Coupon Title"
 *               code:
 *                 type: string
 *                 example: "UPDATEDCODE"
 *               discount:
 *                 type: number
 *                 example: 15
 *               discountType:
 *                 type: string
 *                 example: "fixed_amount"
 *               minPurchase:
 *                 type: number
 *                 example: 75
 *               maxDiscount:
 *                 type: number
 *                 example: 150
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-01-01T00:00:00.000Z"
 *               expireDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: Coupon updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CouponValidation.updateValidation),
  couponController.updateIntoDB,
);

export const couponRoutes = router;
