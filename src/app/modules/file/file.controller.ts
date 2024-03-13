import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import pick from "../../../utils/pick";
import sendResponse from "../../../utils/sendResponse";
import { FileServices } from "./file.service";

// fileUpload
const fileUpload = catchAsync(async (req: Request, res: Response) => {
  const result = await FileServices.file_upload(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "File uploaded successfully",
  });
});

// All files
const allFiles = catchAsync(async (req: Request, res: Response) => {
  const pagination = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await FileServices.get_all_files(pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
    message: "Files retrieved successfully",
  });
});

export const FileController = {
  fileUpload,
  allFiles,
};
