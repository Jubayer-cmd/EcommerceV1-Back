import express from "express";
import { BookingsController } from "./booking.controller";

const router = express.Router();

router.post("/Booking/create-Booking", BookingsController.insertIntoDB);
router.get("/Booking", BookingsController.getBookings);
router.get("/Booking/:id", BookingsController.getBookingsById);
router.get("/Booking/user/:id", BookingsController.getBookingByUserId);
router.delete("/Booking/:id", BookingsController.deleteFromDB);

router.patch("/Booking/:id", BookingsController.updateIntoDB);

export const BookingRoutes = router;
