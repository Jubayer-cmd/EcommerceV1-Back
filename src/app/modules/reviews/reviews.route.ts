import express from "express";
import { reviewsController } from "./reviews.controller";

const router = express.Router();

router.post("/reviews/create-reviews", reviewsController.insertIntoDB);
router.get("/reviews", reviewsController.getreviews);
router.get("/reviews/:id", reviewsController.getreviewsById);

router.delete("/reviews/:id", reviewsController.deleteFromDB);

router.patch("/reviews/:id", reviewsController.updateIntoDB);

export const reviewsRoutes = router;
