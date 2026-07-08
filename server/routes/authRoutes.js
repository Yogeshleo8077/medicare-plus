import { Router } from 'express';
const router = Router();
import { registerUser, verifyOTP, loginUser, logoutUser } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
