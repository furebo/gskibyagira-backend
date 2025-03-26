import express from 'express';
import { googleLogin } from '../controllers/authContoller.js';
const router = express.Router();

router.post('/google-login', googleLogin);

export default router;