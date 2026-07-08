import { Router } from 'express';
const router = Router();
import { getDoctors, getDoctorById } from '../controllers/doctorController.js';

router.get('/', getDoctors);
router.get('/:id', getDoctorById);

export default router;
