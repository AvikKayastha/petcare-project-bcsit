import express from 'express';
import {createUser,loginUser,logoutUser,getUserInfo} from '../controller/userController.js';
import {verifyToken,allowUserOnly} from '../middleware/authMiddleware.js';
import{getUserProfile} from '../controller/userController.js';

const router = express.Router();

// Auth Routes
router.post('/create', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Get authenticated user info
router.get('/userinfo', verifyToken, getUserInfo);

// Protected user (owner) dashboard routes
router.get('/user_dashboard', verifyToken, allowUserOnly, (req, res) => {
  res.render('user_dashboard'); // or use res.sendFile() if serving HTML
});

router.get('/user_profile', verifyToken, allowUserOnly, (req, res) => {
  res.render('user_profile');
});

router.get('/user_booking', verifyToken, allowUserOnly, (req, res) => {
  res.render('user_booking');
});

router.get('/user_payment', verifyToken, allowUserOnly, (req, res) => {
  res.render('user_payment');
});

router.get('/user_message', verifyToken, allowUserOnly, (req, res) => {
  res.render('user_message');
});

router.get('user_profile', verifyToken, allowUserOnly, getUserProfile);


export default router;
