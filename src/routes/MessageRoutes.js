import express from 'express';
import { createMessage,getAllMessages,deleteMessage, editMessage } from '../controllers/messagesController.js';

const router = express.Router();
router.post('/messages',createMessage);
router.get('/messages',getAllMessages);
router.delete('/messages/:id',deleteMessage);
router.put('/messages/:id',editMessage);

export default router;