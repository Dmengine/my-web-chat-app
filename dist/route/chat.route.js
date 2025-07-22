"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controller/chat.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const chat_controller_2 = require("../controller/chat.controller");
const router = express_1.default.Router();
router.post('/chat', authMiddleware_1.authMiddleware, chat_controller_1.CreateChat);
router.get('/chat/:userId', authMiddleware_1.authMiddleware, chat_controller_1.GetUserChats);
router.get('/chat/user/:email', authMiddleware_1.authMiddleware, chat_controller_1.GetUserByEmail);
router.put('/chat/:chatId/add-members', authMiddleware_1.authMiddleware, chat_controller_2.AddMembersToGroup);
exports.default = router;
