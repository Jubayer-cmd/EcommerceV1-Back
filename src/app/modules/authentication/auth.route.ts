import express from 'express';

import { authController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';

const router = express.Router();

router.post('/signup', authController.createUser);

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  authController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  authController.getRefreshToken,
);

router.post('/change-password', authController.changePassword);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.get(
  '/me',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  authController.userDetails,
);

export const authRoutes = router;
