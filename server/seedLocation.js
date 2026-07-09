import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';

dotenv.config();

const updateLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medicare-plus');
    console.log('Connected to DB');

    const doctors = await Doctor.find({});
    
    // Delhi coordinates approximately
    const baseLat = 28.6139;
    const baseLng = 77.2090;

    for (let i = 0; i < doctors.length; i++) {
      const doc = doctors[i];
      // Randomize slightly so they appear as different pins on the map (within ~15km)
      const latOffset = (Math.random() - 0.5) * 0.15;
      const lngOffset = (Math.random() - 0.5) * 0.15;
      
      doc.location = {
        type: 'Point',
        coordinates: [baseLng + lngOffset, baseLat + latOffset]
      };
      
      await doc.save();
      console.log(`Updated location for ${doc.name}`);
    }

    console.log('All doctors updated with locations!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateLocations();
