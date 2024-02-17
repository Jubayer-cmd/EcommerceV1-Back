import express from "express";
import { productController } from "./Product.controller";

const router = express.Router();

router.post("/create-product", productController.insertIntoDB);
router.get("/", productController.getproducts);
router.get("/:id", productController.getProductById);
router.get(
  "/:categoryId/category",
  productController.getproductsbyCategory
);

router.delete("/:id", productController.deleteFromDB);

router.patch("/:id", productController.updateIntoDB);

export const productRoutes = router;
