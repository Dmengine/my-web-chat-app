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
exports.getMessagesByChat = exports.sendMessage = void 0;
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
        const messages = yield message_model_1.Message.find({ chat: chatId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getMessagesByChat = getMessagesByChat;
