import express from 'express';
import { initiateEsewaPayment } from '../controller/petwalkController.js';
import { verifyToken, allowUserOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add authentication middleware to protect the payment route
router.post('/initiate-payment', verifyToken, allowUserOnly, initiateEsewaPayment);

export default router;