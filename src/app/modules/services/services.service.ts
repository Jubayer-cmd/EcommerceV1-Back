import { Service } from "@prisma/client";
import prisma from "../../../utils/prisma";

const insertIntoDB = async (data: Service): Promise<Service> => {
  const result = await prisma.service.create({
    data,
  });
  return result;
};

// const getAllservices = async (
//   filters: IServiceFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<Service[]>> => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(options);
//   const { search, ...filterData } = filters; // Removed 'category' from filters

//   const andConditions = [];

//   if (search) {
//     andConditions.push({
//       OR: serviceSearchableFields.map((field) => ({
//         [field]: {
//           contains: search,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => {
//         if (serviceRelationalFields.includes(key)) {
//           return {
//             [serviceRelationalFieldsMapper[key]]: {
//               id: (filterData as any)[key],
//             },
//           };
//         } else if (serviceSearchableFields.includes(key)) {
//           return {
//             [key]: {
//               contains: (filterData as any)[key],
//               mode: "insensitive",
//             },
//           };
//         } else {
//           return {
//             [key]: {
//               equals: (filterData as any)[key],
//             },
//           };
//         }
//       }),
//     });
//   }

//   const whereConditions: Prisma.ServiceWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.service.findMany({
//     skip,
//     take: Number(limit),
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//     where: whereConditions,
//   });

//   const total = await prisma.service.count({
//     where: whereConditions,
//   });
//   const totalPages = Math.ceil(total / Number(limit));
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages,
//     },
//     data: result,
//   };
// };

const getAllservices = async (): Promise<Service[]> => {
  const result = await prisma.service.findMany();
  return result;
};

// const getAllservices = async (
//   filters: IServiceFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<Service[]>> => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(options);
//   const { search, maxPrice, minPrice, category, ...filterData } = filters;

//   const andConditions = [];

//   if (search) {
//     andConditions.push({
//       OR: serviceSearchableFields.map((field) => ({
//         [field]: {
//           contains: search,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }

//   if (minPrice !== undefined) {
//     andConditions.push({
//       price: {
//         gte: parseFloat(minPrice.toString()),
//       },
//     });
//   }

//   if (maxPrice !== undefined) {
//     andConditions.push({
//       price: {
//         lte: parseFloat(maxPrice.toString()),
//       },
//     });
//   }

//   if (category) {
//     andConditions.push({
//       categoryId: category,
//     });
//   }
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => {
//         if (serviceRelationalFields.includes(key)) {
//           return {
//             [serviceRelationalFieldsMapper[key]]: {
//               id: (filterData as any)[key],
//             },
//           };
//         } else if (serviceSearchableFields.includes(key)) {
//           return {
//             [key]: {
//               contains: (filterData as any)[key],
//               mode: "insensitive",
//             },
//           };
//         } else {
//           return {
//             [key]: {
//               equals: (filterData as any)[key],
//             },
//           };
//         }
//       }),
//     });
//   }

//   const whereConditions: Prisma.serviceWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.service.findMany({
//     skip,
//     take: Number(limit),
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//     where: whereConditions,
//   });

//   const total = await prisma.service.count({
//     where: whereConditions,
//   });
//   const totalPages = Math.ceil(total / Number(limit));
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages,
//     },
//     data: result,
//   };
// };

const getserviceById = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Service>
): Promise<Service> => {
  const result = await prisma.service.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Service> => {
  const result = await prisma.service.delete({
    where: {
      id,
    },
  });
  return result;
};

export const serviceService = {
  insertIntoDB,
  getserviceById,
  updateIntoDB,
  deleteFromDB,
  getAllservices,
};
