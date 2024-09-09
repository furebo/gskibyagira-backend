import dotenv from 'dotenv';
import model from '../database/models';

const Message = model.message;

dotenv.config();

const createMessage = async (req, res) => {
  const { name, email, telephone, message } = req.body;
  if (name === '' || email === ''||telephone =='' || message === '') {
    return res.status(500).json({
      message:"All fields are required.",
    });
  }  
      Message.create({
      name,
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
      const messages = await Message.findAll({
        attributes: ['id', 'name', 'email', 'telephone', 'message'], // Include the fields you want to retrieve
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