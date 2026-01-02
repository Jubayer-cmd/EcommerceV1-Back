import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { categoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.createCategory),
  categoryController.insertIntoDB,
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), categoryController.getAllFromDb);

router.get('/:id', categoryController.getUserById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.deleteFromDB,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.updateCategory),
  categoryController.updateIntoDB,
);

export const categoryRoutes = router;
