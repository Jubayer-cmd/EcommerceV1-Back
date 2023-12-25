import multer from 'multer';
import fs from 'fs';
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Check file types or any other validation here
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: fileFilter,
});

// Function to delete image file
export const deleteImage = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
    } else {
      console.log('Image deleted successfully');
    }
  });
};
