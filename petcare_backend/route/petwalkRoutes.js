import express from 'express';
import { initiateEsewaPayment, getUserBookings } from '../controller/petwalkController.js';
import { verifyToken, allowUserOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing route
router.post('/initiate-payment', verifyToken, allowUserOnly, initiateEsewaPayment);

// New route to get user bookings
router.get('/user_booking', verifyToken, allowUserOnly, getUserBookings);

export default router;