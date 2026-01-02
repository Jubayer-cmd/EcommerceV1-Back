import express from 'express';
import { notificationController } from './notification.controller';

const router = express.Router();

router.post('/', notificationController.addNotification);

router.post('/admin', notificationController.addNotificationToAllUsers);

router.get('/:id', notificationController.getNotificationByUserId);

router.delete('/:id', notificationController.removeAllNotification);

export const notificationRoutes = router;
