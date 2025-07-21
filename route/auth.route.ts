import express from 'express';
import { Register } from '../controller/user.controller';
import { Login } from '../controller/user.controller';
import { Logout } from '../controller/user.controller';


const router = express.Router();
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout)

export default router;