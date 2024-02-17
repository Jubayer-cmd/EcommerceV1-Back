import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { categoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/create-category",
  validateRequest(CategoryValidation.createCategory),
  categoryController.insertIntoDB
);
router.get("/", categoryController.getAllFromDb);
router.get("/:id", categoryController.getUserById);
router.delete("/:id", categoryController.deleteFromDB);
router.patch(
  "/:id",
  validateRequest(CategoryValidation.updateCategory),
  categoryController.updateIntoDB
);

export const categoryRoutes = router;
