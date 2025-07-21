import express from 'express';
import { CreateChat, GetUserChats, GetUserByEmail } from '../controller/chat.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', authMiddleware, CreateChat);
router.get('/chat/:userId', authMiddleware, GetUserChats);
router.get('/chat/user/:email', authMiddleware, GetUserByEmail);

export default router;