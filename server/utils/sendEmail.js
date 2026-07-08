import nodemailer from 'nodemailer';
import dns from 'dns';

// Force IPv4 for Nodemailer to fix ETIMEDOUT on Render
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Define the email options
  const mailOptions = {
    from: `MediCare Plus <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // Optional: if we want HTML emails
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
