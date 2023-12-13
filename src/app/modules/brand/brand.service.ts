import { Brand } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (data: Brand): Promise<Brand> => {
  const result = await prisma.brand.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<Brand[]> => {
  const result = await prisma.brand.findMany();
  return result;
};

const getbrandById = async (id: string): Promise<Brand | null> => {
  const result = await prisma.brand.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Brand>,
): Promise<Brand> => {
  const result = await prisma.brand.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Brand> => {
  const result = await prisma.brand.delete({
    where: {
      id,
    },
  });
  return result;
};

export const brandService = {
  insertIntoDB,
  getAllFromDb,
  getbrandById,
  updateIntoDB,
  deleteFromDB,
};
