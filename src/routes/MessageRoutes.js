import express from 'express';
import { createMessage,getAllMessages } from '../controllers/messagesController';

const router = express.Router();
router.post('/messages',createMessage);
router.get('/messages',getAllMessages);

export default router;