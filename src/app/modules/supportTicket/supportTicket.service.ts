import { Prisma, SupportTicket } from '@prisma/client';
import prisma from '../../../utils/prisma';
import {
  IsupportTicketFilterRequest,
  supportTicketRelationalFields,
  supportTicketRelationalFieldsMapper,
  supportTicketSearchableFields,
} from './supportTicket.interface';
import { IPaginationOptions } from '../../../interface/pagination';
import { IGenericResponse } from '../../../interface/common';
import { paginationHelpers } from '../../../utils/paginationHelper';

const insertIntoDB = async (data: SupportTicket): Promise<SupportTicket> => {
  const result = await prisma.supportTicket.create({
    data,
  });
  return result;
};

const getAllFromDb = async (
  filters: IsupportTicketFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<SupportTicket[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: supportTicketSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (supportTicketRelationalFields.includes(key)) {
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

  const whereConditions: Prisma.SupportTicketWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.supportTicket.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.supportTicket.count({
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

const getsupportTicketsById = async (
  id: string,
): Promise<SupportTicket | null> => {
  const result = await prisma.supportTicket.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<SupportTicket>,
): Promise<SupportTicket> => {
  const result = await prisma.supportTicket.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<SupportTicket> => {
  const result = await prisma.supportTicket.delete({
    where: {
      id,
    },
  });
  return result;
};

export const supportTicketService = {
  insertIntoDB,
  getsupportTicketsById,
  updateIntoDB,
  deleteFromDB,
  getAllFromDb,
};
