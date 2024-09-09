import express from 'express';
import bookRoutes from './BorrowBookRoutes';
import eventRoutes from './EventRoutes';
import userRoutes from './userRoutes';
import staffRoutes from './StaffRoutes';
import createBookRoutes from './BookRoutes';
import messageRoutes from './MessageRoutes';

const router = express.Router();

// Use the bookRoutes for routes starting with /books
router.use('/books', bookRoutes);
router.use('/events',eventRoutes);
router.use('/users',userRoutes);
router.use('/staffs',staffRoutes);
router.use('/books',createBookRoutes);
router.use('/messages',messageRoutes);

export default router;
