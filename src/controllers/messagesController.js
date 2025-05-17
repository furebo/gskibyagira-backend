import dotenv from 'dotenv';
import db from '../database/models/index.js';

//const Message = db.message;

dotenv.config();

const createMessage = async (req, res) => {
  console.log(req.body); // Log request body to see what is being sent

  const { firstName,lastName, email, telephone, message } = req.body;

  if (!firstName || !lastName || !email || !telephone || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }
   
      db.Message.create({
      firstName,
      lastName,
      email,
      telephone,
      message
    })
      .then((data) => {
        if (data) {
             res.status(201).json({
            message:'The message is successfully registered.',
            data,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          error: err.message,
        });
      });
  };

  //the function to get all messages
const getAllMessages = async (req, res) => {
    try {
      const messages = await db.Message.findAll({
        attributes: ['id', 'firstName', 'lastName','email', 'telephone', 'message','createdAt'], // Include the fields you want to retrieve
        order: [['createdAt', 'DESC']], // Sort by latest messages first
      });
  
      if (messages.length === 0) {
        return res.status(404).json({
          message: 'No message found.',
        });
      }
  
      return res.status(200).json({
        message: 'Message retrieved successfully.',
        data: messages,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to retrieve messages.',
        error: error.message,
      });
    }
  };

  // Delete a message by ID
const deleteMessage = async (req, res) => {
  const { id } = req.params; // Get the ID from URL parameters

  try {
    const message = await db.Message.findByPk(id); // Find the message by primary key

    if (!message) {
      return res.status(404).json({
        message: 'Message not found.',
      });
    }

    await message.destroy(); // Delete the message

    return res.status(200).json({
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete the message.',
      error: error.message,
    });
  }
};

// Update a message by ID
const editMessage = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, telephone, message } = req.body;

  try {
    const existingMessage = await db.Message.findByPk(id);

    if (!existingMessage) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await existingMessage.update({
      firstName,
      lastName,
      email,
      telephone,
      message
    });

    return res.status(200).json({
      message: 'Message updated successfully.',
      data: existingMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update the message.',
      error: error.message,
    });
  }
};
//Like a message controller
const like_message = async (req, res) => {
  try {
    const message = await db.message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.likes += 1;
    await message.save();
    res.json({ message: 'Liked!', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//dislike a method
const dislike_message = async (req, res) => {
  try {
    const message = await db.message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.dislikes += 1;
    await message.save();
    res.json({ message: 'Disliked!', data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export {createMessage,getAllMessages,deleteMessage,editMessage, like_message, dislike_message};