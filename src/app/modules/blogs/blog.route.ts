import express from "express";
import { ENUM_USER_ROLE } from "../../../interface/common";
import auth from "../../middleware/auth";
import { blogsController } from "./blog.controller";

const router = express.Router();

router.post("/blogs/create-blogs", blogsController.insertIntoDB);
router.get("/blogs", blogsController.getblogs);
router.get("/blogs/:id", blogsController.getblogsById);

router.delete("/blogs/:id", blogsController.deleteFromDB);

router.patch(
  "/blogs/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  blogsController.updateIntoDB
);

export const blogsRoutes = router;
