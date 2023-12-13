import { Blog } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { blogService } from "./blog.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "blogs created successfully",
    data: result,
  });
});

// get all blogs
const getblogs: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await blogService.getAllFromDb();

    sendResponse<Blog[]>(res, {
      statusCode: 200,
      success: true,
      message: "blogs fetched successfully",
      data: result,
    });
  }
);

const getblogsById = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.getBlogsById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "blogs fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "blogs deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await blogService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "blogs updated successfully",
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
