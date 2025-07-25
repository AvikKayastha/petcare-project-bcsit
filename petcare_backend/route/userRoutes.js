import express from 'express';
import { createUser, loginUser, logoutUser } from '../controller/userController.js';

const router = express.Router();

router.post('/create', createUser);  
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;