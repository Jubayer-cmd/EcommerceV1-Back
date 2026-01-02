import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { bannerController } from './banner.controller';
import { BannerValidation } from './banner.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/create-banner',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BannerValidation.createBanner),
  bannerController.insertIntoDB,
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), bannerController.getAllFromDb);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), bannerController.getBannerById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  bannerController.deleteFromDB,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BannerValidation.updateBanner),
  bannerController.updateIntoDB,
);

export const bannerRoutes = router;
