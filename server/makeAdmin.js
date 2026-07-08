import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide an email address!');
      console.log('Example: node makeAdmin.js your_email@gmail.com');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database...');

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Success! The user ${email} is now an ADMIN.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
