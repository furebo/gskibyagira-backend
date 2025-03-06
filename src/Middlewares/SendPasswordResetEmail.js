import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
//const { google } = require('googleapis');
import { google } from 'googleapis';

dotenv.config();

  // OAuth2 client setup
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,     // Client ID from Developer Console
    process.env.CLIENT_SECRET, // Client Secret from Developer Console
    'https://developers.google.com/oauthplayground' // Redirect URL (for playground)
  );

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
//oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
export const PasswordResetEmail = async (firstname, email, token,emailsubject) => {
    const resetLink = `https://gskibyagiraburuhukiro.netlify.app/reset-password/${token}`;
  try {
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// Generate access token
const accessToken = await oauth2Client.getAccessToken();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,         // Your Gmail address
    clientId: process.env.CLIENT_ID,      // Client ID from Developer Console
    clientSecret: process.env.CLIENT_SECRET,  // Client Secret from Developer Console
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,       // Access token generated from OAuth2
  },
});
   // Sending email
const mailOptions = {
  from: `GS KIBYAGIRA_LMIS <${process.env.EMAIL_USER}`, // Sender email address
  to: email,       // Receiver email address
  subject: emailsubject,
  html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log('Error sending email:', err);
  } else {
    console.log('Email sent successfully:', info);
  }
});
  } catch (err) {
    console.error('Error sending email:', err); // Log the error
  }
};

