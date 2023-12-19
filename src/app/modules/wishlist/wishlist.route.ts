import express from 'express';
import { wishlistController } from './wishlist.controller';

const router = express.Router();

router.post('/:id', wishlistController.insertIntoDB);
router.get('/:id', wishlistController.getUserById);
router.delete('/:id', wishlistController.deleteFromDB);

export const wishlistRoutes = router;
