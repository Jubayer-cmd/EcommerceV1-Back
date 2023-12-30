import express from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';
import { compressAndResizeSingleImage } from '../../middleware/upload-file';

const router = express.Router();

router.get('/', userController.getAllUser);
router.get('/profile', userController.getProfile);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteFromDB);
router.patch('/:id', compressAndResizeSingleImage, userController.updateIntoDB);
router.patch('/admin/:id', userController.updateRoleToAdmin);

export const userRoutes = router;
