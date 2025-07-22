import express from 'express';
import { CreateChat, GetUserChats, GetUserByEmail } from '../src/controller/chat.controller';
import { authMiddleware } from '../src/middleware/authMiddleware';
import { AddMembersToGroup } from '../src/controller/chat.controller';

const router = express.Router();

router.post('/chat', authMiddleware, CreateChat);
router.get('/chat/:userId', authMiddleware, GetUserChats);
router.get('/chat/user/:email', authMiddleware, GetUserByEmail);
router.put('/chat/:chatId/add-members', authMiddleware, AddMembersToGroup);

export default router;