import nodemailer from 'nodemailer';

export function sendEmail(params) {
    const { from,to, subject, html,pass } = params;
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: from, pass },
    });
    let mailOptions = { from,to, subject,html };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error.message);
      }
    });
  }