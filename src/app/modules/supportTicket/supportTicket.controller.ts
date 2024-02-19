import { SupportTicket } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { supportTicketService } from './supportTicket.service';
import pick from '../../../utils/pick';
import { supportTicketSearchableFields } from './supportTicket.constant';



const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await supportTicketService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'supportTickets created successfully',
    data: result,
  });
});

const getsupportTickets = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, supportTicketSearchableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  
  const result = await supportTicketService.getAllFromDb(filters,options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support Ticket retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getsupportTicketsById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await supportTicketService.getsupportTicketsById(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'supportTickets fetched successfully',
      data: result,
    });
  },
);

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await supportTicketService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'supportTickets deleted successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await supportTicketService.updateIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'supportTickets updated successfully',
    data: result,
  });
});

export const supportTicketsController = {
  insertIntoDB,
  getsupportTicketsById,
  updateIntoDB,
  deleteFromDB,
  getsupportTickets,
};
