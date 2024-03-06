import { FlashSaleProduct, FlashSaleProductStatus } from "@prisma/client";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";


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

const expiredFlashSale = async (
  id: string
): Promise<FlashSaleProduct | null> => {
  const result = await prisma.flashSaleProduct.findUnique({
    where: {
      id,
    },

    include: { flashSale: true },
  });
  

  if(!result){
    throw new ApiError(400,"there is no flash sales")
  }

  const flashSaleEndDate = result?.flashSale?.endDate;

   if (flashSaleEndDate && new Date(flashSaleEndDate) < new Date()) {
     
     const expiredUpdate = await prisma.flashSaleProduct.update({
       where: {
         id: result.id,
       },
       data: {
         flasSaleProductSatus: {
           set: FlashSaleProductStatus.expired,
         },
       },
     });

     return expiredUpdate;
   }

  return result;
};

export const FlashSaleProductService = {
  insertIntoDB,
  getAllFromDb,
  getFlashSaleProductById,
  updateIntoDB,
  deleteFromDB,

  expiredFlashSale,
};
