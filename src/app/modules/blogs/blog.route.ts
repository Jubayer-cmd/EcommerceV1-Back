import express from "express";
import { ENUM_USER_ROLE } from "../../../interface/common";
import auth from "../../middleware/auth";
import { blogsController } from "./blog.controller";

const router = express.Router();

/**
 * @swagger
 * /blogs/create-blogs:
 *   post:
 *     tags: [Blogs]
 *     summary: Create a new blog
 *     responses:
 *       200:
 *         description: Blog created
 */
router.post("/blogs/create-blogs", blogsController.insertIntoDB);

/**
 * @swagger
 * /blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Get all blogs
 *     responses:
 *       200:
 *         description: Returns a list of blogs
 */
router.get("/blogs", blogsController.getblogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get a blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Returns the requested blog
 */
router.get("/blogs/:id", blogsController.getblogsById);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Delete a blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Blog deleted
 */
router.delete("/blogs/:id", blogsController.deleteFromDB);

/**
 * @swagger
 * /blogs/{id}:
 *   patch:
 *     tags: [Blogs]
 *     summary: Update an existing blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Blog updated
 */
router.patch(
  "/blogs/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  blogsController.updateIntoDB
);

export const blogsRoutes = router;
