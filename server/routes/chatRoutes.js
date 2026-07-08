import { Router } from 'express';
const router = Router();
import { handleChatMessage } from '../controllers/chatController.js';

router.post('/', handleChatMessage);

export default router;
