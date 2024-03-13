import { Prisma, UserFile } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { pagination_map } from "../../../helpers/pagination";
import { IGenericResponse } from "../../../interface/common";
import { IUploadFile } from "../../../interface/file";
import { IPaginationOptions } from "../../../interface/pagination";
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

// * get_all_files

const get_all_files = async (
  pagination_data: Partial<IPaginationOptions>
): Promise<IGenericResponse<UserFile[]> | null> => {
  //
  const { page, size, skip, sortObject } = pagination_map(
    pagination_data,
    "created_at"
  );

  // and conditions (for search and filter)
  const whereConditions: Prisma.UserFileWhereInput = GetWhereConditions(
    pagination_data as IFileFilter
  );

  //
  const all_file = await prisma.userFile.findMany({
    where: whereConditions,
    skip,
    take: size,
    orderBy: sortObject,
  });
  const total = await prisma.userFile.count({ where: whereConditions });
  const totalPage = Math.ceil(total / size);

  return {
    meta: {
      page: Number(page),
      limit: Number(size),
      total: total,
      totalPages: totalPage,
    },
    data: all_file,
  };
};

export const FileServices = {
  file_upload,
  get_all_files,
};
