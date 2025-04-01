import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { promotionController } from './promotion.controller';
import { PromotionValidation } from './promotion.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

/**
 * @swagger
 * /promotions/create-promotion:
 *   post:
 *     tags: [Promotions]
 *     summary: Create a new promotion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Sale"
 *               code:
 *                 type: string
 *                 example: "SUMMER2023"
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/summer-sale.jpg"
 *               description:
 *                 type: string
 *                 example: "Get discount on summer products"
 *               type:
 *                 type: string
 *                 example: "seasonal_offer"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-08-31T23:59:59.999Z"
 *               discount:
 *                 type: number
 *                 example: 15
 *               discountType:
 *                 type: string
 *                 example: "percentage"
 *               maxDiscount:
 *                 type: number
 *                 example: 100
 *               usageLimit:
 *                 type: number
 *                 example: 1000
 *               usageLimitPerUser:
 *                 type: number
 *                 example: 2
 *               minPurchase:
 *                 type: number
 *                 example: 50
 *               conditions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     conditionType:
 *                       type: string
 *                       example: "minimum_purchase_amount"
 *                     value:
 *                       type: string
 *                       example: "50"
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *     responses:
 *       200:
 *         description: Promotion created
 */
router.post(
  '/create-promotion',
  // auth(ENUM_USER_ROLE.ADMIN),
  // validateRequest(PromotionValidation.createValidation),
  promotionController.insertIntoDB,
);

/**
 * @swagger
 * /promotions:
 *   get:
 *     tags: [Promotions]
 *     summary: Get all promotions
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter active promotions only
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get('/', promotionController.getAllFromDb);

/**
 * @swagger
 * /promotions/{id}:
 *   get:
 *     tags: [Promotions]
 *     summary: Get promotion by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion details
 */
router.get('/:id', promotionController.getPromotionById);

/**
 * @swagger
 * /promotions/validate:
 *   post:
 *     tags: [Promotions]
 *     summary: Validate a promotion code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER2023"
 *               userId:
 *                 type: string
 *                 example: "user-id-here"
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: []
 *               cartTotal:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Promotion validation result
 */
router.post(
  '/validate',
  validateRequest(PromotionValidation.validatePromotionSchema),
  promotionController.validatePromotion,
);

/**
 * @swagger
 * /promotions/record-usage:
 *   post:
 *     tags: [Promotions]
 *     summary: Record promotion usage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionId
 *               - userId
 *             properties:
 *               promotionId:
 *                 type: string
 *                 example: "promotion-id-here"
 *               userId:
 *                 type: string
 *                 example: "user-id-here"
 *               orderId:
 *                 type: string
 *                 example: "order-id-here"
 *     responses:
 *       200:
 *         description: Promotion usage recorded
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Promotion not found
 */
router.post(
  '/record-usage',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(PromotionValidation.recordUsageSchema),
  promotionController.recordUsage,
);

/**
 * @swagger
 * /promotions/{id}:
 *   patch:
 *     tags: [Promotions]
 *     summary: Update promotion by ID
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
 *                 example: "Updated Summer Sale"
 *     responses:
 *       200:
 *         description: Promotion updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  // validateRequest(PromotionValidation.updateValidation),
  promotionController.updateIntoDB,
);

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     tags: [Promotions]
 *     summary: Delete promotion by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion deleted
 */
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  promotionController.deleteFromDB,
);

export const promotionRoutes = router;
