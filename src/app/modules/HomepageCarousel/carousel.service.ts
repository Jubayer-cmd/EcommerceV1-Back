import { HomepageCarousel } from '@prisma/client';
import prisma from '../../../utils/prisma';

export const insertIntoDB = async (
  data: HomepageCarousel,
  files: string[], // Assuming this is an array of image paths or references
): Promise<HomepageCarousel> => {
  const result = await prisma.homepageCarousel.create({ data });

  if (files && files.length > 0) {
    const updatedCarousel = await prisma.homepageCarousel.update({
      where: { id: result.id },
      data: {
        files: { push: files }, // Assuming 'files' is an array of image paths or references
      },
    });
    return updatedCarousel;
  }

  return result;
};

const getAllFromDb = async (): Promise<HomepageCarousel[]> => {
  // Use Prisma to fetch carousel records and include the related user information
  const result = await prisma.homepageCarousel.findMany({});
  return result;
};

const getcarouselById = async (
  id: string,
): Promise<HomepageCarousel | null> => {
  const result = await prisma.homepageCarousel.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<HomepageCarousel>,
): Promise<HomepageCarousel> => {
  const result = await prisma.homepageCarousel.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<HomepageCarousel> => {
  const result = await prisma.homepageCarousel.delete({
    where: {
      id,
    },
  });
  return result;
};

export const carouselervice = {
  insertIntoDB,
  getcarouselById,
  updateIntoDB,
  deleteFromDB,
  getAllFromDb,
};
