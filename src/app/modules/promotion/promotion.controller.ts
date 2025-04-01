import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { promotionService } from './promotion.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await promotionService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion created successfully',
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const options = {
    active: req.query.active,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await promotionService.getAllFromDb(options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotions fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getPromotionById = catchAsync(async (req: Request, res: Response) => {
  const result = await promotionService.getPromotionById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion fetched successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await promotionService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await promotionService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion deleted successfully',
    data: result,
  });
});

const validatePromotion = catchAsync(async (req: Request, res: Response) => {
  const result = await promotionService.validatePromotion(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion is valid',
    data: result,
  });
});

const recordUsage = catchAsync(async (req: Request, res: Response) => {
  const { promotionId, userId, orderId } = req.body;
  const result = await promotionService.recordPromotionUsage(
    promotionId,
    userId,
    orderId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Promotion usage recorded successfully',
    data: result,
  });
});

export const promotionController = {
  insertIntoDB,
  getAllFromDb,
  getPromotionById,
  deleteFromDB,
  updateIntoDB,
  validatePromotion,
  recordUsage,
};
