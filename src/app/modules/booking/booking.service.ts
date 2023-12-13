import { Booking } from "@prisma/client";
import prisma from "../../../utils/prisma";

const insertIntoDB = async (data: Booking): Promise<Booking> => {
  const result = await prisma.booking.create({
    data,
  });
  return result;
};

const getAllFromDb = async (): Promise<Booking[]> => {
  const result = await prisma.booking.findMany({
    include: {
      user: true, // This includes the related user information
      service: true, // This includes the related service information
    },
  });
  return result;
};

const getAllBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  const result = await prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      user: true, // This includes the related user information
      service: true, // This includes the related service information
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getBookingsById = async (id: string): Promise<Booking | null> => {
  const result = await prisma.booking.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Booking>
): Promise<Booking> => {
  const result = await prisma.booking.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Booking> => {
  const result = await prisma.booking.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BookingService = {
  insertIntoDB,
  getBookingsById,
  getAllBookingsByUserId,
  updateIntoDB,
  deleteFromDB,
  getAllFromDb,
};
