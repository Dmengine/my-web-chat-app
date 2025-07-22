import { Request, Response } from 'express';
import {Message} from '../model/message.model';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender, content } = req.body;
    const { chatId } = req.params;

    const message = await Message.create({ sender, content, chat: chatId });
    res.status(201).json(message);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessagesByChat = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
