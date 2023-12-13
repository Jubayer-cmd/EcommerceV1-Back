import { UserReview } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { reviewservice } from "./reviews.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await reviewservice.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "reviews created successfully",
    data: result,
  });
});

// get all reviews
const getreviews: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await reviewservice.getAllFromDb();

    sendResponse<UserReview[]>(res, {
      statusCode: 200,
      success: true,
      message: "reviews fetched successfully",
      data: result,
    });
  }
);

const getreviewsById = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewservice.getreviewsById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "reviews fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewservice.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "reviews deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewservice.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "reviews updated successfully",
    data: result,
  });
});

export const reviewsController = {
  insertIntoDB,
  getreviewsById,
  updateIntoDB,
  deleteFromDB,
  getreviews,
};
