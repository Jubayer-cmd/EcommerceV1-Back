import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { subCategoryController } from './subCategory.controller';
import { SubCategoryValidation } from './subCategory.validation';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post(
  '/create-subCategory',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SubCategoryValidation.createSubCategory),
  subCategoryController.insertIntoDB,
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), subCategoryController.getAllFromDb);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  subCategoryController.getSubCategoryById,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  subCategoryController.deleteFromDB,
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SubCategoryValidation.updateSubCategory),
  subCategoryController.updateIntoDB,
);

export const subCategoryRoutes = router;
