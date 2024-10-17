import express from 'express';
import { registerUser,getAllUsers,editUser,deleteUser,verifyUser } from '../controllers/userController';

const router = express.Router();

router.post('/users',registerUser);
router.get('/users',getAllUsers);
router.put('/users/:id',editUser);
router.delete('/users/:id',deleteUser);
router.get('/verifyuser/:token',verifyUser);

export default router;