import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from "crypto";
//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
//import generatePassword from '../helpers/generatePassword';
//import { sendEmail } from '../helpers/sendEmail';
import { sendVerificationEmail } from '../Middlewares/SendEmail.js';
import db from '../database/models/index.js';
import { template } from '../utils/emailVerificationtemplate.js';
const { user } = db;  // Extract the User model


dotenv.config();
// the function to register a user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password,role } = req.body;
  if (firstName === '' || lastName === '' || email === '' ||password === '') {
    return res.status(500).json({
      message:"All fields are required.",
    });
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
    return res.status(400).json({
      message:'email_invalid',
    });
  } 
  const hashedpassword = await bcrypt.hash(password, 12);
  db.user.findOne({
    where: {
      email,
    },
  }).then((emailExists) => {
    if (emailExists) {
      return res.status(400).json({
        message: 'The user with this email already exist!',
      });
    }else{
      
    db.user.create({
      firstName,
      lastName,
      email,
      hashedpassword,
      role
    })
      .then((user1) => {
        const token = jwt.sign(JSON.parse(JSON.stringify(user1)), process.env.JWT_SECRET, { expiresIn: '1h' });
        jwt.verify(token, process.env.JWT_SECRET, () => {});
        
        //console.log('Calling sendVerificationEmail...');
        sendVerificationEmail(user1.firstName, user1.email, token);
        res.status(201).json({
          message:'You are registered, Please check your email to verify your account',
          user_details: user1,
          token: `JWT ${token}`
        });
      }).catch((err) => {
        res.status(400).json({
          error: err.message,
        });
      });
     
    }
  });
};

//let send a request to reset the password
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 3600000; // 1 hour expiration

    await user.update({ resetToken, tokenExpires });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "furebodidace582@gmail.com",
        pass: "bamurangekayitani123",
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//User reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await db.user.findOne({ where: { resetToken: token, tokenExpires: { [db.Sequelize.Op.gt]: Date.now() } } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    user.hashedpassword = await bcrypt.hash(newPassword, 12);
    user.resetToken = null; // Clear the token
    user.tokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


//the function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'], // Include the fields you want to retrieve
    });
    console.log('All users are :',users)

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
    const user = await db.user.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const updatedUserRecord = req.body
    console.log("The request from body is this one :",updatedUserRecord)

    const updatedrecord = await user.update(updatedUserRecord,{
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

      const user = await db.user.findOne({ where: { id } });

      if (!user) {
          return res.status(404).json({ message: "User record not found." });
      }

      await db.user.destroy({
          where: { id }
      });

      return res.status(200).json({ message: "User record deleted successfully." });
  } catch (error) {
      return res.status(500).json({ message: "Failed to delete User record.", error: error.message });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password} = req.body;

  try {
    // Check if the user exists in the database
    console.log(email);
    const user = await db.user.findOne({ where: {email} });
    //console.log(user.dataValues.isVerified);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //Check if the email is verified in the database.
   // if(user.dataValues.isVerified == null){
      //console.log("The Email is not verified.")
      //return res.status(404).json({message:"Email is not verified. Please verify your Email to login."})
    //return;
    //}

    //console.log(user);
    // Validate the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.hashedpassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role:user.role },
      'secret', // Replace with your JWT secret key
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token to the client
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//verifying the user 
 const verifyUser = async (req, res) => {
  try {
    jwt.verify(req.params.token, process.env.JWT_KEY);

    const user = jwt.decode(req.params.token);
    const userEmail = await model.User.findOne({ where: { email: user.email } });

    if (userEmail.isVerified === true) {
      res.status(400).send(template(user.firstname, null, 'This email is already verified, please click here to login', 'Go to Login'));
    }
    await model.User.update({ isVerified: true }, { where: { email: user.email } });
    //res.status(200).redirect('http://localhost:3000/login');
  } catch (error) {
    res.status(400).send(template('User', null, 'Invalid Token, Please signup again', 'Go to Signup'));
  }
};

//let try to test the functionalities of ES6 rest operator

function Sum(...numbers){
  let total=0;
  for(const num of numbers){
   
    total += num;
  }
  return total
}

console.log(Sum(1,2,3,4))

export {registerUser,getAllUsers,editUser,deleteUser,loginUser,verifyUser,resetPassword}