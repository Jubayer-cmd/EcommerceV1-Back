import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { carouselervice } from './carousel.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const uploadedFiles = req.files as any;
  const filePaths = uploadedFiles.map((file: any) => file.path);
  const result = await carouselervice.insertIntoDB(req.body, filePaths);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'carousel created successfully',
    data: result,
  });
});

// get all carousel
const getcarousel: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await carouselervice.getAllFromDb();
    sendResponse<any>(res, {
      statusCode: 200,
      success: true,
      message: 'carousel fetched successfully',
      data: result,
    });
  },
);

const getcarouselById = catchAsync(async (req: Request, res: Response) => {
  const result = await carouselervice.getcarouselById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'carousel fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await carouselervice.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'carousel deleted successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await carouselervice.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'carousel updated successfully',
    data: result,
  });
});

export const carouselController = {
  insertIntoDB,
  getcarouselById,
  updateIntoDB,
  deleteFromDB,
  getcarousel,
};
