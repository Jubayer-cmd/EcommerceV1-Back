import { UserReview } from "@prisma/client";
import prisma from "../../../utils/prisma";

const insertIntoDB = async (data: UserReview): Promise<UserReview> => {
  const result = await prisma.userReview.create({ data });
  return result;
};

const getAllFromDb = async (): Promise<UserReview[]> => {
  // Use Prisma to fetch UserReview records and include the related user information
  const result = await prisma.userReview.findMany({
    include: {
      user: true, // This includes the related user information
    },
  });
  return result;
};

const getreviewsById = async (id: string): Promise<UserReview | null> => {
  const result = await prisma.userReview.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<UserReview>
): Promise<UserReview> => {
  const result = await prisma.userReview.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<UserReview> => {
  const result = await prisma.userReview.delete({
    where: {
      id,
    },
  });
  return result;
};

export const reviewservice = {
  insertIntoDB,
  getreviewsById,
  updateIntoDB,
  deleteFromDB,
  getAllFromDb,
};
