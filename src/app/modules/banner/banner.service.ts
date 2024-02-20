
import { Banner } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (data: Banner): Promise<Banner> => {
  const result = await prisma.banner.create({
    data,
  });
    return result;
}

const getAllFromDb = async (): Promise<Banner[]> => {
  const result = await prisma.banner.findMany();
  return result;
};

const getBannerById = async (id: string): Promise<Banner | null> => {
  const result = await prisma.banner.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Banner>,
): Promise<Banner> => {
  const result = await prisma.banner.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Banner> => {
  const result = await prisma.banner.delete({
    where: {
      id,
    },
  });
  return result;
};

export const bannerService = {
  insertIntoDB,
  getAllFromDb,
  getBannerById,
  updateIntoDB,
  deleteFromDB,
};