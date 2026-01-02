import express from "express";
import { orderController } from "./order.controller";

const router = express.Router();

router.post("/orders", orderController.createOrder);

router.get("/orders", orderController.getOrders);

router.get("/orders/:id", orderController.getOrderById);

router.get("/orders/user/:id", orderController.getOrderByUserId);

router.delete("/orders/:id", orderController.deleteOrder);

router.patch("/orders/:id", orderController.updateOrder);

export const orderRoutes = router;
