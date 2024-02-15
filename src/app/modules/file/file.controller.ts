import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import pick from "../../../utils/pick";
import sendResponse from "../../../utils/sendResponse";
import { file_filter_keys } from "./file.constant";
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
  const filers = pick(req.query, file_filter_keys);

  const result = await FileServices.get_all_files(filers);

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
