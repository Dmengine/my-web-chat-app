"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ConnectDB_1 = require("./MongoDB/ConnectDB");
const auth_route_1 = __importDefault(require("./route/auth.route"));
const chat_route_1 = __importDefault(require("./route/chat.route"));
const message_route_1 = __importDefault(require("./route/message.route"));
const socketHandler_1 = require("./sockets/socketHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(express_1.default.json());
app.use('/api', auth_route_1.default);
app.use('/api', chat_route_1.default);
app.use('/api', message_route_1.default);
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('API is running...');
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
(0, ConnectDB_1.connectDB)();
(0, socketHandler_1.socketHandler)(io);
