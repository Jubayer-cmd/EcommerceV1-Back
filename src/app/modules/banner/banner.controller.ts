import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { bannerService } from './banner.service';

import { FileUploadHelper } from '../../middleware/fileUploadHelper';
import ApiError from '../../../errors/ApiError';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  if (req.files && 'image' in req.files) {
    const image = Array.isArray(req.files['image'])
      ? req.files['image'][0]
      : (req.files['image'] as Express.Multer.File);
    const uploadResult = await FileUploadHelper.uploadToCloudinary(
      image as any,
    );
    if (!uploadResult) {
      throw new ApiError(500, 'Image upload failed');
    }
    const result = await bannerService.insertIntoDB({
      ...req.body,
      image: uploadResult.secure_url,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Banner created successfully',
      data: result,
    });
  } else {
    throw new ApiError(400, 'Image is required');
  }
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.getAllFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner fetched successfully',
    data: result,
  });
});

const getBannerById = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.getBannerById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
});

export const bannerController = {
  insertIntoDB,
  getAllFromDb,
  getBannerById,
  deleteFromDB,
  updateIntoDB,
};
