import express from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';
import { compressAndResizeSingleImage } from '../../middleware/upload-file';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), userController.getAllUser);
router.get(
  '/profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  userController.getProfile,
);
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.getUserById);
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.deleteFromDB);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  compressAndResizeSingleImage,
  userController.updateIntoDB,
);
router.patch(
  '/admin/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  userController.updateRoleToAdmin,
);

export const userRoutes = router;
