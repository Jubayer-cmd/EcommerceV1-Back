import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { couponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/create-coupon',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CouponValidation.createValidation),
  couponController.insertIntoDB,
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), couponController.getAllFromDb);
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), couponController.getCouponById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  couponController.deleteFromDB,
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CouponValidation.updateValidation),
  couponController.updateIntoDB,
);

export const couponRoutes = router;
