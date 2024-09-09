import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import generatePassword from '../helpers/generatePassword';
import { sendEmail } from '../helpers/sendEmail';
import model from '../database/models';

const User = model.user;

dotenv.config();
// the function to register a user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, role } = req.body;
  const userpassword = generatePassword();
  const password = await bcrypt.hash(userpassword, 12);
  const frontendUrl = process.env.FRONTEND_URL;
 
  if (firstName === '' || lastName === '' || email === '' ||password === '') {
    return res.status(500).json({
      message:"All fields are required.",
    });
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
    return res.status(400).json({
      message:'email_invalid',
    });
  } 

  User.findOne({
    where: {
      email,
    },
  }).then((emailExists) => {
    if (emailExists) {
      return res.status(400).json({
        message: 'The user with this email already exist!',
      });
    }
    return User.create({
      firstName,
      lastName,
      email,
      role,
      password,
    })
      .then((data) => {
        if (data) {
          const query = encodeURIComponent(
            `email=${data.email}&password=${userpassword}`
          );
  
          const html = `
              <h2>Your account has been registered. you can now login in</h2>
              <a href="${frontendUrl}/login?${query}">here</a>
              <p>${req.body.email}. Note that your login password will be <em>${userpassword}</em></p>
              `;
          sendEmail({from:'furebodidace582@gmail.com', to: data.email, subject: 'Registration', html, pass:'bamurangekayitani123' });
          res.status(201).json({
            message:'You are successfully registered.',
            data,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          error: err.message,
        });
      });
  });
};

//the function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'], // Include the fields you want to retrieve
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No users found.',
      });
    }

    return res.status(200).json({
      message: 'Users retrieved successfully.',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve users.',
      error: error.message,
    });
  }
};

//The function to edit a user
const editUser = async (req, res) => {
  const { id } = req.params; // Assuming the user's ID is passed in the URL params
  const { firstName, lastName, email, role } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !role) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  // Validate email format
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format.',
    });
  }

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const updatedUserRecord = req.body
    console.log("The request from body is this one :",updatedUserRecord)

    const updatedrecord = await User.update(updatedUserRecord,{
        where: { id }
    });
    // Respond with the updated user details
    return res.status(200).json({
      message: "User updated successfully.",
      updatedrecord,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user.",
      error: error.message,
    });
  }
};

//function to delete a user
const deleteUser = async (req, res) => {
  try {
      const { id } = req.params; // Assuming the ID is passed as a route parameter

      const user = await User.findOne({ where: { id } });

      if (!user) {
          return res.status(404).json({ message: "User record not found." });
      }

      await User.destroy({
          where: { id }
      });

      return res.status(200).json({ message: "User record deleted successfully." });
  } catch (error) {
      return res.status(500).json({ message: "Failed to delete User record.", error: error.message });
  }
};

export {registerUser,getAllUsers,editUser,deleteUser}