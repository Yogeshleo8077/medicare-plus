import { Router } from 'express';
const router = Router();
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import { createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';
import { getAllPatients } from '../controllers/patientController.js';
import { getAdminAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { getAdminStats } from '../controllers/adminController.js';

// All admin routes are protected and require admin role
router.use(protect, admin);

router.post('/doctors', upload.single('profileImage'), createDoctor);
router.put('/doctors/:id', upload.single('profileImage'), updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

router.get('/patients', getAllPatients);

router.get('/appointments', getAdminAppointments);
router.patch('/appointments/:id/status', updateAppointmentStatus);

router.get('/stats', getAdminStats);

export default router;
