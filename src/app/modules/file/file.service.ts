// import { IUserLogin } from "../user/user.interface";
import { Prisma, UserFile } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IGenericResponse } from "../../../interface/common";
import { IUploadFile } from "../../../interface/file";
import prisma from "../../../utils/prisma";
import { FileUploadHelper } from "../../middleware/fileUploadHelper";
import { GetWhereConditions, IFileFilter } from "./file.condition";

// Create new file
const file_upload = async (req: Request): Promise<UserFile | null> => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  if (uploadedImage) {
    const created_file = await prisma.userFile.create({
      data: {
        title: uploadedImage.display_name,
        url: uploadedImage.secure_url,
        asset_id: uploadedImage.asset_id,
        format: uploadedImage.format,
        width: uploadedImage.width,
        height: uploadedImage.height,
        bytes: uploadedImage.bytes,
      },
    });

    return created_file;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, "Image not uploaded ");
};

const get_all_files = async (
  filers: IFileFilter
): Promise<IGenericResponse<UserFile[]> | null> => {
  const where: Prisma.UserFileWhereInput = GetWhereConditions(filers);
  const files = await prisma.userFile.findMany({
    where,
  });
  return {
    data: files,
  };
};

export const FileServices = {
  file_upload,
  get_all_files,
};
