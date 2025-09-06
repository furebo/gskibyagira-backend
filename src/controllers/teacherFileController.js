import multer from 'multer';
import db from '../database/models/index.js';
import path from 'path';
import fs from 'fs'

const File = db.file;

// configure Multer (files saved in teacherFilesUploads/)
const upload = multer({ dest: 'teacherFilesUploads/' });

// middleware to handle file upload
const uploadMiddleware = upload.single('file');

// Controller: Upload and save file record
export const createTeacherFile = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // 👇 Save metadata in DB
      const file = await File.create({
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path,
        size: req.file.size,
        userId: req.user.id, // coming from JWT (auth middleware)
      });

      return res.status(201).json({
        success: true,
        file,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'File upload failed' });
    }
  });
};

/**
 * @desc List all files uploaded by the logged-in user
 */
export const listTeacherFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  }
};

/**
 * @desc Download a file by id (only if belongs to the user)
 */
export const downloadTeacherFile = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ error: 'File not found' });

    const filePath = path.resolve(file.path);
    return res.download(filePath, file.filename); // triggers browser download
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Download failed' });
  }
};

/**
 * @desc Delete a file by id (only if belongs to the user)
 */
export const deleteTeacherFile = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ error: 'File not found' });

    // delete from filesystem
    fs.unlinkSync(file.path);

    // delete from DB
    await file.destroy();

    return res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Delete failed' });
  }
};