import express from 'express'
import { createComment, getCommentsByMessageId } from '../controllers/commentController.js';

const router = express.Router();

router.post('/messages/:messageId/comments',createComment);
router.get('/messages/:messageId/comments', getCommentsByMessageId);

export default router;