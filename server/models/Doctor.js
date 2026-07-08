import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  availableDays: {
    type: [String],
    required: true,
  },
  availableTime: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
