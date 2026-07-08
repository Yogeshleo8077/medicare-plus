import Doctor from '../models/Doctor.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res, next) => {
  try {
    const { featured, department } = req.query;
    let query = {};
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (department) {
      query.department = department;
    }

    const doctors = await Doctor.find(query);
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
export const createDoctor = async (req, res, next) => {
  try {
    const doctorData = { ...req.body };
    if (req.file) {
      doctorData.profileImage = req.file.path;
    }
    const doctor = await Doctor.create(doctorData);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a doctor
// @route   PUT /api/admin/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne();

    res.status(200).json({ message: 'Doctor removed' });
  } catch (error) {
    next(error);
  }
};
