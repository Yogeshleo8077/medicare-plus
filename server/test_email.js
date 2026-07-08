import dotenv from 'dotenv';
dotenv.config();

import sendEmail from './utils/sendEmail.js';

console.log('Testing Brevo API email send...');

sendEmail({
  email: process.env.EMAIL_USER,
  subject: "Test from Brevo API",
  message: "Hello this is a test from the new HTTP API system"
}).then(() => {
  console.log('Success: Email sent!');
}).catch(err => {
  console.error('Failed:', err);
});
