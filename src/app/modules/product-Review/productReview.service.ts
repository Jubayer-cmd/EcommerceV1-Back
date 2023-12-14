import { ProductReview } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (data: ProductReview): Promise<ProductReview> => {
  const result = await prisma.productReview.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<ProductReview[]> => {
  const result = await prisma.productReview.findMany();
  return result;
};

const getproductReviewById = async (
  id: string,
): Promise<ProductReview | null> => {
  const result = await prisma.productReview.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ProductReview>,
): Promise<ProductReview> => {
  const result = await prisma.productReview.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<ProductReview> => {
  const result = await prisma.productReview.delete({
    where: {
      id,
    },
  });
  return result;
};

export const productReviewService = {
  insertIntoDB,
  getAllFromDb,
  getproductReviewById,
  updateIntoDB,
  deleteFromDB,
};
