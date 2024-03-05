import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { subCategoryController } from './subCategory.controller';
import { SubCategoryValidation } from './subCategory.validation';

const router = express.Router();

router.post(
  '/create-subcategory',
  validateRequest(SubCategoryValidation.createSubCategory),
  subCategoryController.insertIntoDB,
);
router.get('/', subCategoryController.getAllFromDb);
router.get('/:id', subCategoryController.getUserById);
router.delete('/:id', subCategoryController.deleteFromDB);
router.patch(
  '/:id',
  validateRequest(SubCategoryValidation.updateSubCategory),
  subCategoryController.updateIntoDB,
);

export const subCategoryRoutes = router;
