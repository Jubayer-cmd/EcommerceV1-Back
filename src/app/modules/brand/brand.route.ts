import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { brandController } from './brand.controller';
import { BrandValidation } from './brand.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/create-brand',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BrandValidation.createBrand),
  brandController.insertIntoDB,
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), brandController.getAllFromDb);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), brandController.getUserById);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), brandController.deleteFromDB);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BrandValidation.updateBrand),
  brandController.updateIntoDB,
);

export const brandRoutes = router;
