import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const socketHandler = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (socket as any).user = decoded;
      next();
    } catch (err) {
      console.error('Socket auth error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log('New user connected:', socket.id, user?.email || '');

    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${user?.email} joined chat ${chatId}`);
    });

    socket.on('sendMessage', (data) => {
      const { chatId, message } = data;
      socket.to(chatId).emit('receiveMessage', message);
    });

    socket.on('typing', (chatId) => {
      socket.to(chatId).emit('typing', user?._id);
    });

    socket.on('stop_typing', (chatId) => {
      socket.to(chatId).emit('stop_typing', user?._id);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
