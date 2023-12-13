import { SubCategory } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (data: SubCategory): Promise<SubCategory> => {
  const result = await prisma.subCategory.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<SubCategory[]> => {
  const result = await prisma.subCategory.findMany();
  return result;
};

const getsubCategoryById = async (id: string): Promise<SubCategory | null> => {
  const result = await prisma.subCategory.findUnique({
    where: {
      id,
    },
  });
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
  getsubCategoryById,
  updateIntoDB,
  deleteFromDB,
};
