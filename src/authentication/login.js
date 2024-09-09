import bcrypt from 'bcrypt';
import models from '../database/models';
import jwt from 'jsonwebtoken';
const user = models.user;

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRETE, {
      expiresIn:'1h',
    });
  };

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "Please provide email and password",
        });
      }
  
      const User = await user.findOne({ where: { email } });
      console.log(password, User.password);
  
      if (!User || !(bcrypt.compare(password, User.password))) {
        return res.status(401).json({
          message:"invalid email or password",
        });
      }
  
      const token = signToken(User.id);

     // Determine the redirect URL based on the user's role
     let redirectUrl = '';
     if (user.role === 'admin') {
         redirectUrl = '/admin/dashboard';
        } else {
             redirectUrl = '/blog';
           }

      res.status(200).json({
        status:"success status",
        message: `${User.lastName} ${" You are loged in successfully."}`,
        token,
        data: {
          User,
        },
        redirectUrl
      });
    } catch (error) {
      res.status(401).json({
        status:"fail status",
        message:"login error",
        err: error.stack,
        errorMessage: error,
      });
    }
  };

  export {login};