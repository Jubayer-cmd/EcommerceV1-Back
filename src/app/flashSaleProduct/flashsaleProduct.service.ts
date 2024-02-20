import { FlashSaleProduct } from "@prisma/client";
import prisma from "../../utils/prisma";


const insertIntoDB = async (
  data: FlashSaleProduct
): Promise<FlashSaleProduct> => {
  const result = await prisma.flashSaleProduct.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<FlashSaleProduct[]> => {
  const result = await prisma.flashSaleProduct.findMany({
    include: {
      product: true,
      flashSale:true
    },
  });
  return result;
};

const getFlashSaleProductById = async (
  id: string
): Promise<FlashSaleProduct | null> => {
  const result = await prisma.flashSaleProduct.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<FlashSaleProduct>
): Promise<FlashSaleProduct> => {
  const result = await prisma.flashSaleProduct.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<FlashSaleProduct> => {
  const result = await prisma.flashSaleProduct.delete({
    where: {
      id,
    },

    include: {
      product: true,
      flashSale: true,
    },
  });
  return result;
};

export const FlashSaleProductService = {
  insertIntoDB,
  getAllFromDb,
 getFlashSaleProductById,
  updateIntoDB,
  deleteFromDB,
};
