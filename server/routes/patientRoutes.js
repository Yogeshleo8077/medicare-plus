import { Router } from 'express';
const router = Router();
import { protect } from '../middleware/authMiddleware.js';
import { getPatientProfile, updatePatientProfile } from '../controllers/patientController.js';
import { getPatientAppointments } from '../controllers/appointmentController.js';

// All patient routes are protected
router.use(protect);

router.get('/me', getPatientProfile);
router.put('/me', updatePatientProfile);
router.get('/me/appointments', getPatientAppointments);

export default router;
