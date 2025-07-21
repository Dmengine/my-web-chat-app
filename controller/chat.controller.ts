import { Request, Response } from 'express';
import { Chat } from '../model/chat.model';
import { User } from '../model/user.model';

export const CreateChat = async (req: Request, res: Response) => {
    try {
        const { name, members, isGroup } = req.body;
        const chat = await Chat.create({
            name,
            members,
            isGroup
        })
       res.status(201).json(chat);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
}

export const GetUserChats = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const chats = await Chat.find({ members: userId }).populate('members');
    res.json(chats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const GetUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};