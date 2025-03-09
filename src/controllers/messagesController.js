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
export {createMessage,getAllMessages};