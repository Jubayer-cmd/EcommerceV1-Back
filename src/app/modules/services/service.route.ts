import express from 'express';
import { ENUM_USER_ROLE } from '../../../interface/common';
import auth from '../../middleware/auth';
import { serviceController } from './service.controller';

const router = express.Router();

router.post('/services/create-service', serviceController.insertIntoDB);

router.get('/services', serviceController.getservices);

router.get('/services/:id', serviceController.getUserById);

router.delete('/services/:id', serviceController.deleteFromDB);

router.patch(
  '/services/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  serviceController.updateIntoDB,
);

export const serviceRoutes = router;
