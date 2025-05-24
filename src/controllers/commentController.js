import dotenv from 'dotenv';
import db from '../database/models/index.js';
dotenv.config();

//function to create a comment
const createComment = async (req, res) => {
    const { messageId } = req.params;
    const { commentText, commenterName } = req.body;
  
    if (!commentText || !commenterName) {
      return res.status(400).json({ message: 'Comment text and commenter name are required.' });
    }
  
    try {
      // Check if the message exists
      const message = await db.Message.findByPk(messageId);
      if (!message) {
        return res.status(404).json({ message: 'Message not found.' });
      }
   console.log("This is the comment to be created ",message);
   console.log("This is message id ",messageId);
      // Create comment
      const comment = await db.comment.create({
        messageId,
        commenterName,
        commentText,
      });
  
      res.status(201).json({
        message: 'Comment created successfully.',
        data: comment,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create comment.', error: error.message });
      console.log(error)
    }
  };

  //function to get a comment by message id
  const getCommentsByMessageId = async (req, res) => {
    const { messageId } = req.params;
  
    try {
      const comments = await db.comment.findAll({
        where: { messageId },
        order: [['createdAt', 'DESC']],
      });
  
      res.status(200).json({
        message: 'Comments retrieved successfully.',
        comments: comments,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve comments.', error: error.message });
    }
  };
  
export {createComment, getCommentsByMessageId}