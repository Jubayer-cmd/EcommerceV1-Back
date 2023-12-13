import express from "express";
import { productController } from "./Product.controller";

const router = express.Router();

router.post("/products/create-product", productController.insertIntoDB);
router.get("/products", productController.getproducts);
router.get("/products/:id", productController.getProductById);
router.get(
  "/products/:categoryId/category",
  productController.getproductsbyCategory
);

router.delete("/products/:id", productController.deleteFromDB);

router.patch("/products/:id", productController.updateIntoDB);

export const productRoutes = router;
