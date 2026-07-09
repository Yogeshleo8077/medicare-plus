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
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [77.2090, 28.6139] // Default to New Delhi (lng, lat)
    }
  }
}, {
  timestamps: true,
});

doctorSchema.index({ location: '2dsphere' });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
