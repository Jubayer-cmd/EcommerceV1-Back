import { SubCategory } from '@prisma/client';
import prisma from '../../../utils/prisma';
import ApiError from '../../../errors/ApiError';

const insertIntoDB = async (data: SubCategory): Promise<SubCategory> => {
  const existingSubCategory = await prisma.subCategory.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingSubCategory) {
    throw new ApiError(400, 'SubCategory with this name already exists');
  }

  const result = await prisma.subCategory.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<SubCategory[]> => {
  const result = await prisma.subCategory.findMany();
  return result;
};

const getSubCategoryById = async (id: string): Promise<SubCategory | null> => {
  const result = await prisma.subCategory.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(400, 'SubCategory not found with this id');
  }
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<SubCategory>,
): Promise<SubCategory> => {
  const result = await prisma.subCategory.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<SubCategory> => {
  const result = await prisma.subCategory.delete({
    where: {
      id,
    },
  });
  return result;
};

export const subCategoryService = {
  insertIntoDB,
  getAllFromDb,
  getSubCategoryById,
  updateIntoDB,
  deleteFromDB,
};
