import { SupportTicket } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import pick from "../../../utils/pick";
import { flashSaleSearchableFields } from "./flashsale.constant";
import { flashSaleService } from "./flashsale.service";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await flashSaleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "supportTickets created successfully",
    data: result,
  });
});

const getAllFlashSale = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, flashSaleSearchableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await flashSaleService.getAllFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getflashSaleById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await flashSaleService.getFlashSaleById(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Flash sale fetched successfully",
      data: result,
    });
  }
);

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await flashSaleService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash sale deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await flashSaleService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash sale updated successfully",
    data: result,
  });
});

export const flashSalesController = {
  insertIntoDB,
  getAllFlashSale,
  getflashSaleById,
  updateIntoDB,
  deleteFromDB
};
