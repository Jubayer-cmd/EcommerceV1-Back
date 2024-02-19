import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { bannerController } from './banner.controller';
import { BannerValidation } from './banner.validation';

const router = express.Router();

router.post(
  '/create-banner',
  validateRequest(BannerValidation.createBanner),
  bannerController.insertIntoDB,
);
router.get('/', bannerController.getAllFromDb);
router.get('/:id', bannerController.getUserById);
router.delete('/:id', bannerController.deleteFromDB);
router.patch(
  '/:id',
  validateRequest(BannerValidation.updateBanner),
  bannerController.updateIntoDB,
);

export const bannerRoutes = router;