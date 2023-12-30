import { z } from 'zod';

const createSupportTicket = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    status: z.enum(['open', 'closed', 'pending']), // Enum: open, closed, pending, etc.
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

const updateSupportTicket = z.object({
  body: z.object({
    userId: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['open', 'closed', 'pending']).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const SupportTicketValidation = {
  createSupportTicket,
  updateSupportTicket,
};
