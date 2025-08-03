"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketHandler = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication error'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        }
        catch (err) {
            console.error('Socket auth error:', err);
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        console.log('New user connected:', socket.id, (user === null || user === void 0 ? void 0 : user.email) || '');
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${user === null || user === void 0 ? void 0 : user.email} joined chat ${chatId}`);
        });
        socket.on('sendMessage', (data) => {
            const { chatId, message } = data;
            socket.to(chatId).emit('receiveMessage', message);
        });
        socket.on('typing', (chatId) => {
            socket.to(chatId).emit('typing', user === null || user === void 0 ? void 0 : user._id);
        });
        socket.on('stop_typing', (chatId) => {
            socket.to(chatId).emit('stop_typing', user === null || user === void 0 ? void 0 : user._id);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
exports.socketHandler = socketHandler;
