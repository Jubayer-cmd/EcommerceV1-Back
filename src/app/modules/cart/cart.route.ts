import express from 'express';
import { cartController } from './cart.controller';
import validateRequest from '../../middleware/validateRequest';
import { CartValidation } from './cart.validation';

const router = express.Router();

router.post(
  '/add-to-cart/:id',
  validateRequest(CartValidation.addToCart),
  cartController.insertIntoDB,
);

router.get('/:id', cartController.getUserById);

router.delete('/:id', cartController.deleteFromDB);

export const cartRoutes = router;
