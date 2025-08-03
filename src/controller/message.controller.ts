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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chat: chatId });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const markMessagesAsSeen = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.chatId;
    const { userId } = req.body;

    await Message.updateMany(
      { chat: chatId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    res.status(200).json({ message: 'Messages marked as seen' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
