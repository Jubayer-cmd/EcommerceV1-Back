import { Booking } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { BookingService } from "./booking.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings created successfully",
    data: result,
  });
});

// get all Bookings
const getBookings: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.getAllFromDb();

    sendResponse<Booking[]>(res, {
      statusCode: 200,
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  }
);

const getBookingByUserId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.getAllBookingsByUserId(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  }
);

const getBookingsById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getBookingsById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings updated successfully",
    data: result,
  });
});

export const BookingsController = {
  insertIntoDB,
  getBookingsById,
  updateIntoDB,
  getBookingByUserId,
  deleteFromDB,
  getBookings,
};
