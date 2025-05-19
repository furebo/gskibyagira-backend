import express from 'express';
import { createMessage,getAllMessages,deleteMessage, editMessage, like_message, dislike_message } from '../controllers/messagesController.js';

const router = express.Router();
router.post('/messages',createMessage);
router.get('/messages',getAllMessages);
router.delete('/messages/:id',deleteMessage);
router.put('/messages/:id',editMessage);
router.patch('/messages/:id/like',like_message);
router.put('/messages/:id/dislike',dislike_message);

export default router;