import { Category } from '@prisma/client';
import prisma from '../../../utils/prisma';
import ApiError from '../../../errors/ApiError';

const insertIntoDB = async (data: Category): Promise<Category> => {
  // Check if a category with the same name already exists
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new ApiError(400, 'Category with the same name already exists');
  }

  const result = await prisma.category.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<Category[]> => {
  const result = await prisma.category.findMany();
  return result;
};

const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(400, 'Category not found with the provided ID');
  }
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Category>,
): Promise<Category> => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Category> => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CategoryService = {
  insertIntoDB,
  getAllFromDb,
  getCategoryById,
  updateIntoDB,
  deleteFromDB,
};
