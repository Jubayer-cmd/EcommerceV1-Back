import express from 'express';
import { ENUM_USER_ROLE } from '../../../interface/common';
import auth from '../../middleware/auth';
import { serviceController } from './service.controller';

const router = express.Router();

/**
 * @swagger
 * /services/create-service:
 *   post:
 *     tags: [Services]
 *     summary: Create a new service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Service Name"
 *               description:
 *                 type: string
 *                 example: "Service Description"
 *     responses:
 *       200:
 *         description: Service created
 */
router.post('/services/create-service', serviceController.insertIntoDB);

/**
 * @swagger
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: Get all services
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/services', serviceController.getservices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 */
router.get('/services/:id', serviceController.getUserById);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Delete service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete('/services/:id', serviceController.deleteFromDB);

/**
 * @swagger
 * /services/{id}:
 *   patch:
 *     tags: [Services]
 *     summary: Update service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Service Name"
 *               description:
 *                 type: string
 *                 example: "Updated Service Description"
 *     responses:
 *       200:
 *         description: Service updated
 */
router.patch(
  '/services/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  serviceController.updateIntoDB,
);

export const serviceRoutes = router;
