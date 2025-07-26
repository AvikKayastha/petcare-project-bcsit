import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createUser, loginUser, getUserInfo, logoutUser } from '../controller/userController.js';

const router = express.Router();

router.post('/create', createUser);  
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/userinfo', verifyToken, getUserInfo);

export default router;