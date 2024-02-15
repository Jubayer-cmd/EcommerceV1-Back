import express from "express";
import { FileUploadHelper } from "../../middleware/fileUploadHelper";
import { FileController } from "./file.controller";

const router = express.Router();

router.post(
  "/upload",
  FileUploadHelper.upload.single("file"),
  FileController.fileUpload
);

router.get("/", FileController.allFiles);

export const FileRoute = router;
