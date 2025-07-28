import express from 'express';
import {
  verifyToken,
  allowCaretakerOnly
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected caretaker routes
router.get('/caretaker_dashboard', verifyToken, allowCaretakerOnly, (req, res) => {
  res.render('caretaker_dashboard');
});

router.get('/caretaker_schedule', verifyToken, allowCaretakerOnly, (req, res) => {
  res.render('caretaker_schedule');
});

router.get('/caretaker_booking', verifyToken, allowCaretakerOnly, (req, res) => {
  res.render('caretaker_booking');
});

router.get('/caretaker_payment', verifyToken, allowCaretakerOnly, (req, res) => {
  res.render('caretaker_payment');
});

router.get('/caretaker_message', verifyToken, allowCaretakerOnly, (req, res) => {
  res.render('caretaker_message');
});

export default router;
