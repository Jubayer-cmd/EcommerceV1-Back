import express from "express";
import { ENUM_USER_ROLE } from "../../../interface/common";
import auth from "../../middleware/auth";

import validateRequest from "../../middleware/validateRequest";
import { flashSalesController } from "./flashsale.controller";
import { FlashSaleValidation } from "./flashSale.validation";


const router = express.Router();

router.post(
  "/create-flash-sale",
  validateRequest(FlashSaleValidation.createFlashSale),
  flashSalesController.insertIntoDB
);
router.get("/", flashSalesController.getAllFlashSale);
router.get("/:id", flashSalesController.getflashSaleById);

router.delete("/:id", flashSalesController.deleteFromDB);

router.patch(
  "/:id",
  validateRequest(FlashSaleValidation.updateFlashSale),

  flashSalesController.updateIntoDB
);

export const flashSaleRoutes = router;
