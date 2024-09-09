import express from 'express';
import { CreateStaff,updateStaff,allStaff,deleteStaff } from '../controllers/staffController';

const router = express.Router();

router.post('/staffs',CreateStaff);
router.get('/staffs',allStaff);
router.put('/staffs/:id',updateStaff);
router.delete('/staffs/:id',deleteStaff);

export default router;