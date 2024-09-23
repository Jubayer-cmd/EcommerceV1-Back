import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryResponse, IUploadFile } from '../../interface/file';
import envConfig from '../../config/envConfig';

let streamifier = require('streamifier');

cloudinary.config({
  cloud_name: envConfig.cloudinary.cloud_name,
  api_key: envConfig.cloudinary.api_key,
  api_secret: envConfig.cloudinary.api_secret,
});

const uploadToCloudinary = async (
  file: IUploadFile,
): Promise<ICloudinaryResponse | null> => {
  return new Promise((resolve, reject) => {
    // Ensure file.data is being used instead of buffer
    if (!file.data) {
      return reject(new Error('File data is missing'));
    }

    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: `${envConfig.bucketName}`,
        display_name: file.name, // Changed from file.originalname for express-fileupload
        original_filename: file.name, // file.name in express-fileupload
      },
      (error: any, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );

    // Use file.data instead of file.buffer
    streamifier.createReadStream(file.data).pipe(cld_upload_stream);
  });
};

export const FileUploadHelper = {
  uploadToCloudinary,
};
