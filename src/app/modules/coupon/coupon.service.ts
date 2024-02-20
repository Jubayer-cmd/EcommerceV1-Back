import { Coupon } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (data: Coupon): Promise<Coupon> => {
  const result = await prisma.coupon.create({
    data,
  });
    return result;
}

const getAllFromDb = async (): Promise<Coupon[]> => {
  const result = await prisma.coupon.findMany();
  return result;
};

const getCouponById = async (id: string): Promise<Coupon | null> => {
  const result = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Coupon>,
): Promise<Coupon> => {
  const result = await prisma.coupon.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Coupon> => {
  const result = await prisma.coupon.delete({
    where: {
      id,
    },
  });
  return result;
};

export const couponService = {
  insertIntoDB,
  getAllFromDb,
  getCouponById,
  updateIntoDB,
  deleteFromDB,
};
