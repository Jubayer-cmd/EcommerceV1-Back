import express from 'express';
import { carouselController } from './carousel.controller';
import { compressAndResizeMultipleImages } from '../../middleware/upload-file';

const router = express.Router();

router.post(
  '/',
  compressAndResizeMultipleImages,
  carouselController.insertIntoDB,
);
router.get('/', carouselController.getcarousel);
router.get('/:id', carouselController.getcarouselById);
router.delete('/:id', carouselController.deleteFromDB);

export const carouselRoutes = router;
