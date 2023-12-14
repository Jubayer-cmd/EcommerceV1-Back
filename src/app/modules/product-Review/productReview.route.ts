import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { productReviewController } from './productReview.controller';
import { ProductReviewValidation } from './productReview.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ProductReviewValidation.createProductReview),
  productReviewController.insertIntoDB,
);
router.get('/', productReviewController.getAllFromDb);
router.get('/:id', productReviewController.getUserById);
router.delete('/:id', productReviewController.deleteFromDB);
router.patch(
  '/:id',
  validateRequest(ProductReviewValidation.updateProductReview),
  productReviewController.updateIntoDB,
);

export const productReviewRoutes = router;
