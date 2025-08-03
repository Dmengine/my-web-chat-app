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
exports.GetChatDetails = exports.AddMembersToGroup = exports.GetUserByEmail = exports.GetUserChats = exports.CreateChat = void 0;
const chat_model_1 = require("../model/chat.model");
const user_model_1 = require("../model/user.model");
const CreateChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // console.log('Req.user in CreateChat:', req.user);
    try {
        const { name, members, isGroup } = req.body;
        const chat = yield chat_model_1.Chat.create({
            name,
            members,
            isGroup,
            admin: isGroup ? (_a = req.user) === null || _a === void 0 ? void 0 : _a._id : undefined,
        });
        // Populate members and admin fields for the response
        const populatedChat = yield chat_model_1.Chat.findById(chat._id)
            .populate('members', 'username email')
            .populate('admin', '_id username email');
        res.status(201).json(populatedChat);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
exports.CreateChat = CreateChat;
const GetUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Hit GetUserChats route with userId:', req.params.userId);
    try {
        const userId = req.params.userId;
        const chats = yield chat_model_1.Chat.find({ members: userId })
            .populate('members', 'username email')
            .populate('admin', '_id username email');
        // console.log('User chats with admin populated:', chats);
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
    var _a, _b;
    try {
        const { chatId } = req.params;
        const { newMembers } = req.body;
        const chat = yield chat_model_1.Chat.findById(chatId)
            .populate('members', 'username email')
            .populate('admin', '_id username email');
        if (!chat || !chat.isGroup) {
            return res.status(400).json({
                message: 'Chat not found or is not a group chat'
            });
        }
        if (((_a = chat.admin) === null || _a === void 0 ? void 0 : _a._id.toString()) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id)) {
            return res.status(403).json({
                message: 'Only the admin can add members to this group chat'
            });
        }
        const updatedChat = yield chat_model_1.Chat.findByIdAndUpdate(chatId, { $addToSet: { members: { $each: newMembers } } }, // Avoids duplicates
        { new: true })
            .populate('members', 'username email')
            .populate('admin', '_id username email');
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
const GetChatDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Hit GetChatDetails route with chatId:', req.params.chatId);
    try {
        const { chatId } = req.params;
        const chat = yield chat_model_1.Chat.findById(chatId)
            .populate('members', 'username email')
            .populate('admin', '_id username email');
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json(chat);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.GetChatDetails = GetChatDetails;
