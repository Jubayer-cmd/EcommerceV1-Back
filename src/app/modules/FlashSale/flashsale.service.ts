import { Prisma, FlashSale } from "@prisma/client";
import prisma from "../../../utils/prisma";

import { IPaginationOptions } from "../../../interface/pagination";
import { IGenericResponse } from "../../../interface/common";
import { paginationHelpers } from "../../../utils/paginationHelper";
import { IflashSaleFilterRequest, flashSaleRelationalFields, flashSaleSearchableFields } from "./flashsale.constant";
import { supportTicketRelationalFieldsMapper } from "../supportTicket/supportTicket.constant";




const insertIntoDB = async (data: FlashSale): Promise<FlashSale> => {
 
  const result = await prisma.flashSale.create({
    data: data,
  });
  return result;
};

const getAllFromDb = async (
  filters: IflashSaleFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<FlashSale[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: flashSaleSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (flashSaleRelationalFields.includes(key)) {
          return {
            [supportTicketRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.FlashSaleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flashSale.findMany({
    where: whereConditions,
    skip,
    take: limit,

    include:{
      products:true
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.flashSale.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getFlashSaleById = async (id: string): Promise<FlashSale | null> => {
  const result = await prisma.flashSale.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<FlashSale>
): Promise<FlashSale> => {
  const result = await prisma.flashSale.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<FlashSale> => {
  const result = await prisma.flashSale.delete({
    where: {
      id,
    },
  });
  return result;
};

export const flashSaleService = {
  insertIntoDB,
 getFlashSaleById,

  updateIntoDB,
  deleteFromDB,
  getAllFromDb,
};
