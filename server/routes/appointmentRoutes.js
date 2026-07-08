import { Router } from 'express';
const router = Router();
import { protect } from '../middleware/authMiddleware.js';
import { bookAppointment, cancelPatientAppointment } from '../controllers/appointmentController.js';

// All appointment routes are protected
router.use(protect);

router.post('/', bookAppointment);
router.patch('/:id/cancel', cancelPatientAppointment);

export default router;
