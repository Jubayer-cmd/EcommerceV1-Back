import { Order, Prisma, OrderProduct } from '@prisma/client';
import { IGenericResponse } from '../../../interface/common';
import { IPaginationOptions } from '../../../interface/pagination';
import { paginationHelpers } from '../../../utils/paginationHelper';
import prisma from '../../../utils/prisma';
import {
  IOrderFilterRequest,
  orderRelationalFields,
  orderRelationalFieldsMapper,
  orderSearchableFields,
} from './order.constants';
import { sslService } from '../../middleware/ssl.service';

const createOrder = async (data: Order): Promise<Order | string> => {
  const {
    userId,
    totalAmount,
    status,
    firstName,
    lastName,
    address,
    city,
    postcode,
    note,
    phone,
    paymentMethod,
    // @ts-ignore
    orderProduct,
  } = data;

  if (paymentMethod === 'COD') {
    // If payment method is cash on delivery, create order directly without creating a payment
    const order = await prisma.$transaction(async (prisma) => {
      const orderProductData = orderProduct.map((product: any) => ({
        productId: product.productId,
        quantity: product.quantity,
      }));

      const createdOrder = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status,
          firstName,
          lastName,
          address,
          city,
          postcode,
          note,
          paymentMethod,
          phone,
          orderProduct: {
            create: orderProductData,
          },
        },
      });

      return createdOrder;
    });

    return order;
  }

  // If payment method is online, initiate the payment process through the payment gateway
  const paymentSession = await sslService.initPayment({
    total_amount: totalAmount,
    tran_id: 'unique_transaction_id', // Generate a unique transaction ID here
    cus_name: `${firstName} ${lastName}`,
    cus_email: 'sheikhabujubayer@gmail.com', // Add the email logic here
    cus_add1: address,
    cus_phone: phone,
  });

  // Return the URL to redirect for online payment
  return paymentSession.redirectGatewayURL;
};

const getAllOrders = async (
  filters: IOrderFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Order[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map((field) => ({
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
        if (orderRelationalFields.includes(key)) {
          return {
            [orderRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    // Include related models if needed
    where: whereConditions,
    include: {
      orderProduct: {
        include: {
          product: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.order.count({
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

const getAllOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const result = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      orderProduct: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getOrderById = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderProduct: {
        include: {
          product: true, // Include the product information
        },
      },
    },
  });
  return result;
};

const updateOrder = async (
  id: string,
  payload: Partial<Order>,
): Promise<Order> => {
  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteOrder = async (id: string): Promise<Order> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
  });
  return result;
};

export const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  getAllOrdersByUserId,
  updateOrder,
  deleteOrder,
};
