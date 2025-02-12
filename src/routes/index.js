import express from 'express';
import bookRoutes from './BorrowBookRoutes.js';
import eventRoutes from './EventRoutes.js';
import userRoutes from './userRoutes.js';
import staffRoutes from './StaffRoutes.js';
import createBookRoutes from './BookRoutes.js';
import messageRoutes from './MessageRoutes.js';
import userLoginRoutes from './UserLoginRoutes.js'

const router = express.Router();

// Use the bookRoutes for routes starting with /books
router.use('/books', bookRoutes);
router.use('/events',eventRoutes);
router.use('/users',userRoutes);
router.use('/staffs',staffRoutes);
router.use('/books',createBookRoutes);
router.use('/messages',messageRoutes);
router.use('/',userLoginRoutes);

export default router;
