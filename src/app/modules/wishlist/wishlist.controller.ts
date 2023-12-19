import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { wishlistService } from './wishlist.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const productId = req.body.productId;
  const result = await wishlistService.addProductToWishlist(userId, productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'wishlist created successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.getWishlistByUserId(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'wishlist fetched successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.removeProductFromWishlist(
    req.params.id,
    req.body.productId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'wishlist deleted successfully',
    data: result,
  });
});

export const wishlistController = {
  insertIntoDB,
  getUserById,
  deleteFromDB,
};
