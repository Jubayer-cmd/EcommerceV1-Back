import express from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../interface/common';
import { compressAndResizeSingleImage } from '../../middleware/upload-file';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth(ENUM_USER_ROLE.ADMIN), userController.getAllUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [User]
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: User profile
 */
router.get(
  '/profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  userController.getProfile,
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.deleteFromDB);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [User]
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  compressAndResizeSingleImage,
  userController.updateIntoDB,
);

/**
 * @swagger
 * /users/admin/{id}:
 *   patch:
 *     tags: [User]
 *     summary: Update user role to admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User role updated to admin
 */
router.patch(
  '/admin/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  userController.updateRoleToAdmin,
);

export const userRoutes = router;
