import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { questionController } from './proQues.controller';
import { ProductQuestionValidation } from './proQues.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ProductQuestionValidation.createProductQuestion),
  questionController.insertIntoDB,
);

router.get('/', questionController.getAllFromDb);

router.get('/:id', questionController.getUserById);

router.delete('/:id', questionController.deleteFromDB);

router.patch(
  '/:id',
  validateRequest(ProductQuestionValidation.updateProductQuestion),
  questionController.updateIntoDB,
);

export const questionRoutes = router;
