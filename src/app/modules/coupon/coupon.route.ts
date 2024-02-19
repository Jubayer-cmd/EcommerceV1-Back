import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { couponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';

const router = express.Router();

router.post(
  '/create-coupon',
  validateRequest(CouponValidation.createValidation),
  couponController.insertIntoDB,
);

router.get('/', couponController.getAllFromDb);
router.get('/:id', couponController.getCouponById);
router.delete('/:id', couponController.deleteFromDB);
router.patch(
  '/:id',
  validateRequest(CouponValidation.updateValidation),
  couponController.updateIntoDB,
);

export const couponRoutes = router;