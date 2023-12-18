import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { cartService } from './cart.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const result = await cartService.insertIntoDB(userId, productId, quantity);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cart created successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await cartService.getcartById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cart fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await cartService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cart deleted successfully',
    data: result,
  });
});

export const cartController = {
  insertIntoDB,
  getUserById,
  deleteFromDB,
};
