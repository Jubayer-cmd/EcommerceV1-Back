import express from "express";
import { orderController } from "./order.controller";

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user-id"
 *               totalAmount:
 *                 type: number
 *                 example: 100.0
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               paymentMethod:
 *                 type: string
 *                 example: "online"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               postcode:
 *                 type: string
 *                 example: "10001"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Order created
 */
router.post("/orders", orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/orders", orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */
router.get("/orders/:id", orderController.getOrderById);

/**
 * @swagger
 * /orders/user/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get orders by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get("/orders/user/:id", orderController.getOrderByUserId);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.delete("/orders/:id", orderController.deleteOrder);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Order updated
 */
router.patch("/orders/:id", orderController.updateOrder);

export const orderRoutes = router;
