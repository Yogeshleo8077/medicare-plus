import { Router } from 'express';
const router = Router();
import { protect } from '../middleware/authMiddleware.js';
import { bookAppointment } from '../controllers/appointmentController.js';

// All appointment routes are protected
router.use(protect);

router.post('/', bookAppointment);

export default router;
