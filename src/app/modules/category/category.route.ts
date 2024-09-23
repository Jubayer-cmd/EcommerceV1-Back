import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { categoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/categories/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.createCategory),
  categoryController.insertIntoDB,
);
router.get(
  '/categories',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.getAllFromDb,
);
router.get('/categories/:id', categoryController.getUserById);
router.delete(
  '/categories/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.deleteFromDB,
);
router.patch(
  '/categories/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(CategoryValidation.updateCategory),
  categoryController.updateIntoDB,
);

export const categoryRoutes = router;
