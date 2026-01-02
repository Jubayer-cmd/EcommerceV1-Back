import express from 'express';
import { ENUM_USER_ROLE } from '../../../interface/common';
import auth from '../../middleware/auth';
import { supportTicketsController } from './supportTicket.controller';
import validateRequest from '../../middleware/validateRequest';
import { SupportTicketValidation } from './supportTicket.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(SupportTicketValidation.createSupportTicket),
  supportTicketsController.insertIntoDB,
);

router.get('/', supportTicketsController.getsupportTickets);

router.get('/:id', supportTicketsController.getsupportTicketsById);

router.delete('/:id', supportTicketsController.deleteFromDB);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SupportTicketValidation.updateSupportTicket),
  supportTicketsController.updateIntoDB,
);

export const supportTicketsRoutes = router;
