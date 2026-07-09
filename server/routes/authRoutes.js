import { Router } from 'express';
const router = Router();
import { registerUser, verifyOTP, loginUser, logoutUser, forgotPassword, resetPassword } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
