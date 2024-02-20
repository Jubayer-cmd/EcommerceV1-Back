import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FlashSaleProductService } from "./flashsaleProduct.service";



const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleProductService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale Product created successfully",
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleProductService.getAllFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale Product fetched successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleProductService.getFlashSaleProductById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale Product fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleProductService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale Product deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleProductService.updateIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale Product updated successfully",
    data: result,
  });
});

export const FlashSaleProductController = {
  insertIntoDB,
  getAllFromDb,
  getUserById,
  updateIntoDB,
  deleteFromDB,
};
