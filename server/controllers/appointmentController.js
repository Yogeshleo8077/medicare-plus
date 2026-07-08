import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import sendWhatsappMessage from '../utils/sendWhatsapp.js';

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

    // Send Email Notification to Patient
    try {
      const patient = await User.findById(patientId);
      const message = `Hello ${patient.name},\n\nYour appointment request with Dr. ${doctor.name} on ${date} at ${timeSlot} has been received and is pending admin approval.\n\nThank you,\nMediCare Plus Team`;
      
      sendEmail({
        email: patient.email,
        subject: 'Appointment Request Received - MediCare Plus',
        message,
      }).catch(err => console.error('Email sending failed (Render block):', err));

      if (patient.phone) {
        sendWhatsappMessage({
          phone: patient.phone,
          message: `*Appointment Request Received*\n\n` + message,
        }).catch(err => console.error('WhatsApp sending failed:', err));
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We don't fail the appointment creation if email fails
    }

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

    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    // Send Email Notification on Status Change
    try {
      const patient = appointment.patientId;
      const doctor = appointment.doctorId;
      let message = '';
      let subject = '';

      if (status === 'approved') {
        subject = 'Appointment Approved - MediCare Plus';
        message = `Hello ${patient.name},\n\nGreat news! Your appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.timeSlot} is confirmed.\n\nPlease arrive 10 minutes early.\n\nThank you,\nMediCare Plus Team`;
      } else if (status === 'cancelled') {
        subject = 'Appointment Cancelled - MediCare Plus';
        message = `Hello ${patient.name},\n\nWe regret to inform you that your appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.timeSlot} has been cancelled.\n\nPlease log in to book another slot or contact support.\n\nThank you,\nMediCare Plus Team`;
      }

      if (message) {
        sendEmail({
          email: patient.email,
          subject,
          message,
        }).catch(err => console.error('Email sending failed (Render block):', err));

        if (patient.phone) {
          sendWhatsappMessage({
            phone: patient.phone,
            message: `*${subject}*\n\n${message}`,
          }).catch(err => console.error('WhatsApp sending failed:', err));
        }
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment (Patient)
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (Patient)
export const cancelPatientAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify the appointment belongs to the logged in patient
    if (appointment.patientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Only allow cancelling if it's pending
    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: `Cannot cancel an appointment with status: ${appointment.status}` });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Send Email Notification to Patient (Optional, but good UX)
    try {
      const patient = await User.findById(req.user.id);
      const doctor = appointment.doctorId;
      
      const message = `Hello ${patient.name},\n\nYou have successfully cancelled your pending appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.timeSlot}.\n\nThank you,\nMediCare Plus Team`;
      
      sendEmail({
        email: patient.email,
        subject: 'Appointment Cancelled - MediCare Plus',
        message,
      }).catch(err => console.error('Email sending failed (Render block):', err));

      if (patient.phone) {
        sendWhatsappMessage({
          phone: patient.phone,
          message: `*Appointment Cancelled*\n\n${message}`,
        }).catch(err => console.error('WhatsApp sending failed:', err));
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    next(error);
  }
};
