"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const user_controller_2 = require("../controller/user.controller");
const user_controller_3 = require("../controller/user.controller");
const router = express_1.default.Router();
router.post('/register', user_controller_1.Register);
router.post('/login', user_controller_2.Login);
router.post('/logout', user_controller_3.Logout);
exports.default = router;
