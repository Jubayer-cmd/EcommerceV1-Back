import express from 'express';
import { notificationController } from './notification.controller';

const router = express.Router();

/**
 * @swagger
 * /notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Add a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Notification Title"
 *               content:
 *                 type: string
 *                 example: "Notification Content"
 *     responses:
 *       200:
 *         description: Notification added
 */
router.post('/', notificationController.addNotification);

/**
 * @swagger
 * /notifications/admin:
 *   post:
 *     tags: [Notifications]
 *     summary: Add a notification to all users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Notification Title"
 *               content:
 *                 type: string
 *                 example: "Notification Content"
 *     responses:
 *       200:
 *         description: Notification added to all users
 */
router.post('/admin', notificationController.addNotificationToAllUsers);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/:id', notificationController.getNotificationByUserId);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Remove all notifications by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications removed
 */
router.delete('/:id', notificationController.removeAllNotification);

export const notificationRoutes = router;
