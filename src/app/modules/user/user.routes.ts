import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/users", userController.getAllUser);
router.get("/profile", userController.getProfile);
router.get("/users/:id", userController.getUserById);
router.delete("/users/:id", userController.deleteFromDB);
router.patch("/users/:id", userController.updateIntoDB);
router.patch("/users/admin/:id", userController.updateRoleToAdmin);

export const userRoutes = router;
