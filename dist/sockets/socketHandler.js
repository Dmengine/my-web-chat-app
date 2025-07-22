"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('New user connected:', socket.id);
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chat ${chatId}`);
        });
        socket.on('sendMessage', (data) => {
            const { chatId, message } = data;
            socket.to(chatId).emit('receiveMessage', message);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
        socket.on('typing', (chatId) => {
            socket.to(chatId).emit('typing', socket.id);
        });
        socket.on('stop_typing', (chatId) => {
            socket.to(chatId).emit('stop_typing', socket.id);
        });
    });
};
exports.socketHandler = socketHandler;
