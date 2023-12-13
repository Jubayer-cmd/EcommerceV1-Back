import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { brandController } from './brand.controller';
import { BrandValidation } from './brand.validation';

const router = express.Router();

router.post(
  '/create-brand',
  validateRequest(BrandValidation.createBrand),
  brandController.insertIntoDB,
);
router.get('/', brandController.getAllFromDb);
router.get('/:id', brandController.getUserById);
router.delete('/:id', brandController.deleteFromDB);
router.patch(
  '/:id',
  validateRequest(BrandValidation.updateBrand),
  brandController.updateIntoDB,
);

export const brandRoutes = router;
