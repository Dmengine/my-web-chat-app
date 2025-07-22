import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './MongoDB/ConnectDB';
import authRoutes from './route/auth.route';
import ChatRoute from './route/chat.route';
import messageRoute from './route/message.route';
import { socketHandler } from './sockets/socketHandler';

dotenv.config();



const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});


app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json())
app.use('/api', authRoutes);
app.use('/api', ChatRoute);
app.use('/api', messageRoute);

const PORT = process.env.PORT || 3000;


app.get('/', (req:Request, res:Response) => {
    res.send('API is running...');
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

connectDB()

socketHandler(io);