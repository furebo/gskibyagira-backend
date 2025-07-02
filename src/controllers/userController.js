import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../Middlewares/SendEmail.js';
import { PasswordResetEmail } from '../Middlewares/SendPasswordResetEmail.js';
import db from '../database/models/index.js';
import { template } from '../utils/emailVerificationtemplate.js';


dotenv.config();
// the function to register a user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if user already exists
    const existingUser = await db.user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "The user with this email already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = await db.user.create({
      firstName,
      lastName,
      email,
      hashedPassword, // Use password, not hashedPassword
      role:'Teacher'
    });

    //  Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //  Send verification email
    sendVerificationEmail(newUser.firstName, newUser.email, token, "Verify your Email");

    return res.status(201).json({
      message: "You are registered. Please check your email to verify your account.",
      user_details: { id: newUser.id, email: newUser.email, role: newUser.role },
      token
    });

  } catch (err) {
    console.error("Error in registerUser:", err); // Logs full error details
    return res.status(500).json({ error: err.message || "Something went wrong!" });
  }
};

//let send a request to reset the password
 const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 3600000; // 1 hour expiration

    await user.update({ resetToken, tokenExpires });

    PasswordResetEmail(user.firstName, user.email, resetToken,"Reset Password");

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
      console.log("we got the user ",user);

  // Hash the new password and update user details
  await user.update(
    {
      hashedPassword: await bcrypt.hash(newPassword, 12), // Use the correct field name
      resetToken: null, 
      tokenExpires: null
    }, 
    { individualHooks: true } // Ensure hooks (if any) run
  );

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
    const user = await db.user.findOne({ where: {email} });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
     // Check if email is verified
     if (user.isVerified !== 'Yes') {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
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
    console.log(user);
    res.status(200).json({ message: 'Login successful', token, user});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//verifying the user 
 const verifyUser = async (req, res) => {
  try {
    jwt.verify(req.params.token, process.env.JWT_KEY);
    console.log("This is the token from user email frontend :",req.params.token)

    const User = jwt.decode(req.params.token);
    const userEmail = await db.user.findOne({ where: { email: User.email } });

    if (userEmail.isVerified == "Yes") {
      res.status(400).send(template(User.firstName, null, 'This email is already verified, please click the link bellow to go back to home page and then login to BMIS', 'Back to Homepage'));
    }
    await db.user.update({ isVerified: "Yes" }, { where: { email: User.email } });
    res.status(200).send(template(User.firstName, null, 'Email verified successfully, please click the link bellow to go back to home page and then login to BMIS', 'Back to Homepage'));
  } catch (error) {
    console.log("This is the error found: ",error)
    res.status(400).send(template('User', null, 'Invalid Token, Please signup again', 'Go to Signup'));
  }
};

//function to resend verification email
const resendVerification = async (req,res) => {
  const { email } = req.body;

  const user = await db.user.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'No user found with this email.' });
  }

  if (user.isVerified === 'Yes') {
    return res.status(400).json({ message: 'This account is already verified.' });
  }
  
  //  Generate JWT Token
  const verificationToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
 sendVerificationEmail(user.firstName, user.email, verificationToken, "Verify your Email");

  res.json({ message: 'Verification email has been resent. Please check your inbox.' });
}

export {registerUser,getAllUsers,editUser,deleteUser,loginUser,verifyUser,requestPasswordReset,resetPassword,resendVerification}
