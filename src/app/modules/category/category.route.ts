import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/categories/create-category",
  validateRequest(CategoryValidation.createCategory),
  categoryController.insertIntoDB
);
router.get("/categories", categoryController.getAllFromDb);
router.get("/categories/:id", categoryController.getUserById);
router.delete("/categories/:id", categoryController.deleteFromDB);
router.patch(
  "/categories/:id",
  validateRequest(CategoryValidation.updateCategory),
  categoryController.updateIntoDB
);

export const categoryRoutes = router;
