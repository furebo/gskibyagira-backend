import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,  
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'lmisapp', // Replace with the folder name you want in Cloudinary
    format: async (req, file) => 'jpg', // Or use file.originalname.split('.').pop(); to keep the original format
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`, // Use the original file name without extension as public ID
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Initialize multer with Cloudinary storage
const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).single('image_url');

export default upload;

