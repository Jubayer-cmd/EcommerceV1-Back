import express from 'express';
import { cartController } from './cart.controller';

const router = express.Router();

router.post('/add-to-cart/:id', cartController.insertIntoDB);
router.get('/:id', cartController.getUserById);
router.delete('/:id', cartController.deleteFromDB);

export const cartRoutes = router;
