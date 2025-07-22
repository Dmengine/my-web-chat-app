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
exports.AddMembersToGroup = exports.GetUserByEmail = exports.GetUserChats = exports.CreateChat = void 0;
const chat_model_1 = require("../model/chat.model");
const user_model_1 = require("../model/user.model");
const CreateChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, members, isGroup } = req.body;
        const chat = yield chat_model_1.Chat.create({
            name,
            members,
            isGroup
        });
        res.status(201).json(chat);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.CreateChat = CreateChat;
const GetUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const chats = yield chat_model_1.Chat.find({ members: userId }).populate('members');
        res.json(chats);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.GetUserChats = GetUserChats;
const GetUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield user_model_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.GetUserByEmail = GetUserByEmail;
const AddMembersToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const { newMembers } = req.body;
        const updatedChat = yield chat_model_1.Chat.findByIdAndUpdate(chatId, { $addToSet: { members: { $each: newMembers } } }, // Avoids duplicates
        { new: true }).populate('members');
        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json(updatedChat);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.AddMembersToGroup = AddMembersToGroup;
