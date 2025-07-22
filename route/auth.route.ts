import express from 'express';
import { Register } from '../src/controller/user.controller';
import { Login } from '../src/controller/user.controller';
import { Logout } from '../src/controller/user.controller';


const router = express.Router();
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout)

export default router;