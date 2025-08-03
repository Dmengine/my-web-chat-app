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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Login = exports.Register = void 0;
const user_model_1 = require("../model/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Register endpoint hit");
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send({
                message: 'Please fill all the fields',
                success: false
            });
        }
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                message: 'User already exists',
                success: false
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_model_1.User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).send({
            message: 'User registered successfully',
            success: true,
            data: newUser
        });
    }
    catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).send({
            message: 'Internal server error',
            success: false,
            error: error.message
        });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                messaage: 'Please fill all the fields',
                success: false
            });
        }
        const existingUser = yield user_model_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({
                message: 'User does not exist',
                success: false
            });
        }
        const comparePassword = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!comparePassword) {
            return res.status(400).send({
                message: 'Invalid credentials',
                success: false
            });
        }
        const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '8d'
        });
        res.status(200).send({
            message: 'Login successful',
            success: true,
            data: existingUser,
            token: token
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Failed to login",
            success: false,
        });
    }
});
exports.Login = Login;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send({
            message: 'Logout successful',
            success: true
        });
    }
    catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed. Something went wrong.',
        });
    }
});
exports.Logout = Logout;
