"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessagesAsSeen = exports.getMessagesByChat = exports.sendMessage = void 0;
const message_model_1 = require("../model/message.model");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, content } = req.body;
        const { chatId } = req.params;
        const message = yield message_model_1.Message.create({ sender, content, chat: chatId });
        res.status(201).json(message);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.sendMessage = sendMessage;
const getMessagesByChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = req.params.chatId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const messages = yield message_model_1.Message.find({ chat: chatId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
        const total = yield message_model_1.Message.countDocuments({ chat: chatId });
        res.json({
            messages,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getMessagesByChat = getMessagesByChat;
const markMessagesAsSeen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = req.params.chatId;
        const { userId } = req.body;
        yield message_model_1.Message.updateMany({ chat: chatId, seenBy: { $ne: userId } }, { $addToSet: { seenBy: userId } });
        res.status(200).json({ message: 'Messages marked as seen' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.markMessagesAsSeen = markMessagesAsSeen;
