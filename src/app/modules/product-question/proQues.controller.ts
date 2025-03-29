import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { questionService } from './proQues.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await questionService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'question created successfully',
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await questionService.getAllFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'question fetched successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await questionService.getquestionById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'question fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await questionService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'question deleted successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await questionService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'question updated successfully',
    data: result,
  });
});

export const questionController = {
  insertIntoDB,
  getAllFromDb,
  getUserById,
  updateIntoDB,
  deleteFromDB,
};
