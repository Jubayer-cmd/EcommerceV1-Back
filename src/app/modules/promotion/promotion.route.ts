import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { promotionController } from './promotion.controller';
import { PromotionValidation } from './promotion.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/create-promotion',
  // auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(PromotionValidation.createValidation),
  promotionController.insertIntoDB,
);

router.get('/', promotionController.getAllFromDb);

router.get('/:id', promotionController.getPromotionById);

router.post(
  '/validate',
  validateRequest(PromotionValidation.validatePromotionSchema),
  promotionController.validatePromotion,
);

router.post(
  '/record-usage',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(PromotionValidation.recordUsageSchema),
  promotionController.recordUsage,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(PromotionValidation.updateValidation),
  promotionController.updateIntoDB,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  promotionController.deleteFromDB,
);

export const promotionRoutes = router;
