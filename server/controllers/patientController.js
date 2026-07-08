import User from '../models/User.js';

// @desc    Get patient profile
// @route   GET /api/patients/me
// @access  Private
export const getPatientProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/me
// @access  Private
export const updatePatientProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      
      // Email updates might require re-verification, keeping it simple for now
      // password updates handled separately typically

      const updatedUser = await user.save();
      
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private/Admin
export const getAllPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};
