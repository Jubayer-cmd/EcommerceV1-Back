import express from 'express';
import { ENUM_USER_ROLE } from '../../../interface/common';
import auth from '../../middleware/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentController.getAllFromDB,
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentController.getByIdFromDB,
);

router.post('/init', PaymentController.initPayment);

router.post('/webhook', PaymentController.webhook);

export const paymentRoutes = router;
