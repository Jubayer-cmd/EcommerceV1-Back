import express from "express";
import { FlashSaleProductController } from "./flashsaleProduct.controller";
import { FlashSaleProductValidation } from "./flashsaleProduct.validation";
import validateRequest from "../middleware/validateRequest";



const router = express.Router();

router.post(
  "/create-flash-sale-product",
  validateRequest(FlashSaleProductValidation.createFlashSaleProduct),
  FlashSaleProductController.insertIntoDB
);
router.get("/", FlashSaleProductController.getAllFromDb);
router.get("/:id", FlashSaleProductController.getUserById);
router.delete("/:id", FlashSaleProductController.deleteFromDB);
router.patch(
  "/:id",
  validateRequest(FlashSaleProductValidation.updateFlashSaleProduct),
  FlashSaleProductController.updateIntoDB
);

export const FlashSaleProductRoutes = router;
