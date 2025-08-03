import express from 'express';
import { sendMessage, getMessagesByChat, markMessagesAsSeen } from '../controller/message.controller';

const router = express.Router();

router.post('/message/:chatId', sendMessage);
router.get('/message/:chatId', getMessagesByChat);
router.put('/message/:chatId/mark-seen', markMessagesAsSeen);


export default router;
