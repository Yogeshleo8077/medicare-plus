import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing connection to MongoDB...');
console.log('URI used:', process.env.MONGODB_URI.replace(/:([^:@]{3,})@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR:', err.message);
    process.exit(1);
  });
