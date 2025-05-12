import express from 'express';
import { registerUser,getAllUsers,editUser,deleteUser,verifyUser,resendVerification } from '../controllers/userController.js';

const router = express.Router();

router.post('/users',registerUser);
router.get('/users',getAllUsers);
router.put('/users/:id',editUser);
router.delete('/users/:id',deleteUser);
router.get('/verifyuser/:token',verifyUser);
router.post('/resend-verification',resendVerification);

export default router;