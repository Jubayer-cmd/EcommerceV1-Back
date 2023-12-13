import { Blog } from "@prisma/client";
import prisma from "../../../utils/prisma";

const insertIntoDB = async (data: Blog): Promise<Blog> => {
  const result = await prisma.blog.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<Blog[]> => {
  const result = await prisma.blog.findMany();
  return result;
};

const getBlogsById = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Blog>
): Promise<Blog> => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Blog> => {
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

export const blogService = {
  insertIntoDB,
  getBlogsById,
  updateIntoDB,
  deleteFromDB,
  getAllFromDb,
};
