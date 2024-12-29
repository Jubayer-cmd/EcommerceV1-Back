import express from 'express';
import { ENUM_USER_ROLE } from '../../../interface/common';
import auth from '../../middleware/auth';
import { supportTicketsController } from './supportTicket.controller';
import validateRequest from '../../middleware/validateRequest';
import { SupportTicketValidation } from './supportTicket.validation';

const router = express.Router();

/**
 * @swagger
 * /support-tickets:
 *   post:
 *     tags: [SupportTickets]
 *     summary: Create a new support ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SupportTicket'
 *     responses:
 *       200:
 *         description: Support ticket created
 */
router.post(
  '/',
  validateRequest(SupportTicketValidation.createSupportTicket),
  supportTicketsController.insertIntoDB,
);

/**
 * @swagger
 * /support-tickets:
 *   get:
 *     tags: [SupportTickets]
 *     summary: Get all support tickets
 *     responses:
 *       200:
 *         description: List of support tickets
 */
router.get('/', supportTicketsController.getsupportTickets);

/**
 * @swagger
 * /support-tickets/{id}:
 *   get:
 *     tags: [SupportTickets]
 *     summary: Get support ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support ticket details
 */
router.get('/:id', supportTicketsController.getsupportTicketsById);

/**
 * @swagger
 * /support-tickets/{id}:
 *   delete:
 *     tags: [SupportTickets]
 *     summary: Delete support ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support ticket deleted
 */
router.delete('/:id', supportTicketsController.deleteFromDB);

/**
 * @swagger
 * /support-tickets/{id}:
 *   patch:
 *     tags: [SupportTickets]
 *     summary: Update support ticket by ID
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
 *             $ref: '#/components/schemas/SupportTicket'
 *     responses:
 *       200:
 *         description: Support ticket updated
 */
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SupportTicketValidation.updateSupportTicket),
  supportTicketsController.updateIntoDB,
);

export const supportTicketsRoutes = router;
