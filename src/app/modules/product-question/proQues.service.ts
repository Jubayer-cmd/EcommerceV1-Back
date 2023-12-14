import { ProductQuestion } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (
  data: ProductQuestion,
): Promise<ProductQuestion> => {
  const result = await prisma.productQuestion.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<ProductQuestion[]> => {
  const result = await prisma.productQuestion.findMany();
  return result;
};

const getquestionById = async (id: string): Promise<ProductQuestion | null> => {
  const result = await prisma.productQuestion.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ProductQuestion>,
): Promise<ProductQuestion> => {
  const result = await prisma.productQuestion.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<ProductQuestion> => {
  const result = await prisma.productQuestion.delete({
    where: {
      id,
    },
  });
  return result;
};

export const questionService = {
  insertIntoDB,
  getAllFromDb,
  getquestionById,
  updateIntoDB,
  deleteFromDB,
};
