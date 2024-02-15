import { v2 as cloudinary } from "cloudinary";
let streamifier = require("streamifier");

import multer from "multer";
import { ICloudinaryResponse, IUploadFile } from "../../interface/file";

cloudinary.config({
  cloud_name: "decj7ot9x",
  api_key: "648445453865225",
  api_secret: "XK_xNGZwS_NoiPtuan3EgRf_GVI",
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse | null> => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommercev1",
        display_name: file.originalname,
        original_filename: file.originalname,
      },
      (error: any, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
  });
};

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};
