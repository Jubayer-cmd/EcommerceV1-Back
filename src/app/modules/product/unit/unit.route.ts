import express from 'express';
import { unitController } from './unit.controller';
import validateRequest from '../../../middleware/validateRequest';
import { UnitValidation } from './unit.validation';

const router = express.Router();

/**
 * @swagger
 * /units:
 *   post:
 *     tags: [Units]
 *     summary: Create a new unit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Kilogram"
 *               shortName:
 *                 type: string
 *                 example: "kg"
 *               description:
 *                 type: string
 *                 example: "Weight unit"
 *     responses:
 *       200:
 *         description: Unit created successfully
 */
router.post(
  '/create-unit',
  validateRequest(UnitValidation.createUnit),
  unitController.createUnit,
);

/**
 * @swagger
 * /units:
 *   get:
 *     tags: [Units]
 *     summary: Get all units
 *     responses:
 *       200:
 *         description: Units retrieved successfully
 */
router.get('/', unitController.getAllUnits);

/**
 * @swagger
 * /units/{id}:
 *   get:
 *     tags: [Units]
 *     summary: Get unit by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit retrieved successfully
 */
router.get('/:id', unitController.getUnitById);

/**
 * @swagger
 * /units/{id}:
 *   patch:
 *     tags: [Units]
 *     summary: Update unit by ID
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
 *                 example: "Updated Unit Name"
 *               shortName:
 *                 type: string
 *                 example: "uun"
 *     responses:
 *       200:
 *         description: Unit updated successfully
 */
router.patch(
  '/:id',
  validateRequest(UnitValidation.updateUnit),
  unitController.updateUnit,
);

/**
 * @swagger
 * /units/{id}:
 *   delete:
 *     tags: [Units]
 *     summary: Delete unit by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 */
router.delete('/:id', unitController.deleteUnit);

export const unitRoutes = router;
