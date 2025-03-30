import { Blog } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { blogService } from './blog.service';
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

    const result = await blogService.insertIntoDB({
      ...req.body,
      image: uploadResult.secure_url,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'blogs created successfully',
      data: result,
    });
  } else {
    throw new ApiError(400, 'Image is required');
  }
});

// get all blogs
const getblogs: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await blogService.getAllFromDb();

    sendResponse<Blog[]>(res, {
      statusCode: 200,
      success: true,
      message: 'blogs fetched successfully',
      data: result,
    });
  },
);

const getblogsById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.getBlogsById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'blogs fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'blogs deleted successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  let updatedData = { ...req.body };

  // Handle image upload if present
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

    // Add image URL to the update data
    updatedData.image = uploadResult.secure_url;
  }

  const result = await blogService.updateIntoDB(req.params.id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'blogs updated successfully',
    data: result,
  });
});

export const blogsController = {
  insertIntoDB,
  getblogsById,
  updateIntoDB,
  deleteFromDB,
  getblogs,
};
