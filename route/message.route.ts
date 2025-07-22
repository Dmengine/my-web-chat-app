import express from 'express';
import { sendMessage, getMessagesByChat } from '../src/controller/message.controller';

const router = express.Router();

router.post('/message/:chatId', sendMessage);
router.get('/message/:chatId', getMessagesByChat);


export default router;
