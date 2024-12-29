import express from 'express';
import { BookingsController } from './booking.controller';

const router = express.Router();

/**
 * @swagger
 * /Booking/create-Booking:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new Booking
 *     responses:
 *       200:
 *         description: Booking created
 */
router.post('/Booking/create-Booking', BookingsController.insertIntoDB);

/**
 * @swagger
 * /Booking:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all Bookings
 *     responses:
 *       200:
 *         description: List of Bookings
 */
router.get('/Booking', BookingsController.getBookings);

/**
 * @swagger
 * /Booking/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get Booking by ID
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Booking fetched
 */
router.get('/Booking/:id', BookingsController.getBookingsById);

/**
 * @swagger
 * /Booking/user/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get Bookings by User ID
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: User Booking fetched
 */
router.get('/Booking/user/:id', BookingsController.getBookingByUserId);

/**
 * @swagger
 * /Booking/{id}:
 *   delete:
 *     tags: [Bookings]
 *     summary: Delete a Booking
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Booking deleted
 */
router.delete('/Booking/:id', BookingsController.deleteFromDB);

/**
 * @swagger
 * /Booking/{id}:
 *   patch:
 *     tags: [Bookings]
 *     summary: Update a Booking
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.patch('/Booking/:id', BookingsController.updateIntoDB);

export const BookingRoutes = router;
