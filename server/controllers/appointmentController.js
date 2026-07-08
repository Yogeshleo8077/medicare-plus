import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user.id;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Duplicate slot prevention (Bonus)
    // The compound index in DB will throw error 11000 if exists, but we can check explicitly
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (existingAppointment) {
      // 409 Conflict as requested in PRD
      return res.status(409).json({ message: 'Time slot already booked for this doctor' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      status: 'pending',
    });

    res.status(201).json(appointment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Time slot already booked for this doctor' });
    }
    next(error);
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/me/appointments
// @access  Private (Patient)
export const getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'name department profileImage')
      .sort({ date: 1, timeSlot: 1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointment requests (Admin)
// @route   GET /api/admin/appointments
// @access  Private/Admin
export const getAdminAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name department')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Cancel Appointments
// @route   PATCH /api/admin/appointments/:id/status
// @access  Private/Admin
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};
