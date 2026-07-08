import { Router } from 'express';
const router = Router();
import { getDoctors, getDoctorById, getDoctorBookedSlots } from '../controllers/doctorController.js';

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/booked-slots', getDoctorBookedSlots);

export default router;
