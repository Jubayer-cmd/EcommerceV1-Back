import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { subCategoryController } from './subCategory.controller';
import { SubCategoryValidation } from './subCategory.validation';

const router = express.Router();

router.post(
  '/create-subCategory',
  validateRequest(SubCategoryValidation.createSubCategory),
  subCategoryController.insertIntoDB,
);
router.get('/subCategories', subCategoryController.getAllFromDb);
router.get('/subCategories/:id', subCategoryController.getUserById);
router.delete('/subCategories/:id', subCategoryController.deleteFromDB);
router.patch(
  '/subCategories/:id',
  validateRequest(SubCategoryValidation.updateSubCategory),
  subCategoryController.updateIntoDB,
);

export const subCategoryRoutes = router;
