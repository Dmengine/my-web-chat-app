import { Request, Response } from 'express';
import { Chat } from '../model/chat.model';
import { User } from '../model/user.model';


export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email?: string;
    username?: string;
    // admin?: string;
  };
}

export const CreateChat = async (req: AuthRequest, res: Response) => {
  // console.log('Req.user in CreateChat:', req.user);
    try {
        const { name, members, isGroup } = req.body;
        const chat = await Chat.create({
            name,
            members,
            isGroup,
            admin: isGroup ? req.user?._id : undefined,
        });

        // Populate members and admin fields for the response
        const populatedChat = await Chat.findById(chat._id)
            .populate('members', 'username email')
            .populate('admin', '_id username email');

       res.status(201).json(populatedChat);
    } catch (error: any) {
        console.error(error);
       res.status(500).json({ error: error.message });
    }
}

export const GetUserChats = async (req: Request, res: Response) => {
  // console.log('Hit GetUserChats route with userId:', req.params.userId);
  try {
    const userId = req.params.userId;
    const chats = await Chat.find({ members: userId })
      .populate('members', 'username email')
      .populate('admin', '_id username email');
    // console.log('User chats with admin populated:', chats);
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

export const AddMembersToGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { newMembers } = req.body;

    const chat = await Chat.findById(chatId)
      .populate('members', 'username email')
      .populate('admin', '_id username email');

    if( !chat || !chat.isGroup) {
      return res.status(400).json({
        message: 'Chat not found or is not a group chat'
      })
    }

    if (chat.admin?._id.toString() !== req.user?._id) {
      return res.status(403).json({
        message: 'Only the admin can add members to this group chat'
      })
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { members: { $each: newMembers } } }, // Avoids duplicates
      { new: true }
    )
      .populate('members', 'username email')
      .populate('admin', '_id username email');

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(updatedChat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const GetChatDetails = async (req: AuthRequest, res: Response) => {
  console.log('Hit GetChatDetails route with chatId:', req.params.chatId);
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('members', 'username email')
      .populate('admin', '_id username email');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
