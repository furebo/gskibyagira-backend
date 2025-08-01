import express from 'express';
import authRoutes from './AuthRoutes.js'
import bookRoutes from './BorrowBookRoutes.js';
import eventRoutes from './EventRoutes.js';
import userRoutes from './userRoutes.js';
import staffRoutes from './StaffRoutes.js';
import createBookRoutes from './BookRoutes.js';
import messageRoutes from './MessageRoutes.js';
import userLoginRoutes from './UserLoginRoutes.js'
import requestPasswordResetRoute from './RequestPasswordReset.js';
import resetPasswordRoute from './ResetPasswordRoute.js';
import commentsRoutes from './commentsRoutes.js';

const router = express.Router();

// Use the bookRoutes for routes starting with /books
router.use('/auth',authRoutes);
router.use('/books', bookRoutes);
router.use('/events',eventRoutes);
router.use('/users',userRoutes);
router.use('/staffs',staffRoutes);
router.use('/books',createBookRoutes);
router.use('/messages',messageRoutes);
router.use('/',userLoginRoutes);
router.use('/reset',requestPasswordResetRoute);
router.use('/',resetPasswordRoute);
router.use('/',commentsRoutes);

export default router;
