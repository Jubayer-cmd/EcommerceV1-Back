import express from "express";
import { ENUM_USER_ROLE } from "../../../interface/common";
import auth from "../../middleware/auth";

import validateRequest from "../../middleware/validateRequest";
import { flashSalesController } from "./flashsale.controller";


const router = express.Router();

router.post(
  "/create-flash-sale",

  flashSalesController.insertIntoDB
);
router.get("/", flashSalesController.getAllFlashSale);
router.get("/:id", flashSalesController.getflashSaleById);

router.delete("/:id", flashSalesController.deleteFromDB);

router.patch(
  "/:id",
  // auth(ENUM_USER_ROLE.ADMIN),

  flashSalesController.updateIntoDB
);

export const flashSaleRoutes = router;
