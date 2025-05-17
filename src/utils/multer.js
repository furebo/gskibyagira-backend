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
    public_id: (req, file) => file.originalname.split('.')[0], // Use the original file name without extension as public ID
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage }).single('image_url');

export default upload;

