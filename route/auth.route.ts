import express from 'express';
import { Register } from '../controller/user.controller';
import { Login } from '../controller/user.controller';


const router = express.Router();
router.post('/register', Register);
router.post('/login', Login);

export default router;