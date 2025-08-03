"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controller/message.controller");
const router = express_1.default.Router();
router.post('/message/:chatId', message_controller_1.sendMessage);
router.get('/message/:chatId', message_controller_1.getMessagesByChat);
router.put('/message/:chatId/mark-seen', message_controller_1.markMessagesAsSeen);
exports.default = router;
