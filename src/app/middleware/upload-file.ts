import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

interface UploadedFile extends Express.Multer.File {
  destination: string;
}

const storage = multer.diskStorage({
  destination: function (req: Request, file: UploadedFile, cb: Function) {
    cb(null, 'uploads');
  },
  filename: function (req: Request, file: UploadedFile, cb: Function) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const fileFilter: any = (
  req: Request,
  file: UploadedFile,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files are allowed!'), false);
  }
};

export const deleteImage = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
    } else {
      console.log('Image deleted successfully');
    }
  });
};

export const compressAndResizeSingleImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const singleUpload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter,
  }).single('image');

  singleUpload(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const uploadedFile = req.file as UploadedFile;
    if (uploadedFile) {
      try {
        const resizedImagePath = `resized-${uploadedFile.filename}`;
        await sharp(uploadedFile.path)
          .resize(500)
          .jpeg({ quality: 70 })
          .toFile(path.resolve(uploadedFile.destination, resizedImagePath));

        fs.unlinkSync(uploadedFile.path);
        uploadedFile.path = path.resolve(
          uploadedFile.destination,
          resizedImagePath,
        );
      } catch (error) {
        console.error('Error compressing or resizing image:', error);
        return res
          .status(500)
          .json({ error: 'Error compressing or resizing image' });
      }
    }
    next();
  });
};

export const compressAndResizeMultipleImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const multipleUpload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter,
  }).array('images', 5);

  multipleUpload(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const uploadedFiles = req.files as UploadedFile[];
    if (uploadedFiles && uploadedFiles.length > 0) {
      try {
        req.files = await Promise.all(
          uploadedFiles.map(async (file) => {
            const resizedImagePath = `img-${file.filename}`;
            await sharp(file.path)
              .resize(500)
              .jpeg({ quality: 70 })
              .toFile(path.resolve(file.destination, resizedImagePath));

            fs.unlinkSync(file.path);
            return {
              ...file,
              path: path.resolve(file.destination, resizedImagePath),
            };
          }),
        );
      } catch (error) {
        console.error('Error compressing or resizing images:', error);
        return res
          .status(500)
          .json({ error: 'Error compressing or resizing images' });
      }
    }
    next();
  });
};

// FIXME : fix the api error
