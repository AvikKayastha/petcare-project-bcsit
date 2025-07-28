import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import contactRoutes from './route/contactRoutes.js';
import petwalkRoutes from './route/petwalkRoutes.js';
import userRoutes from './route/userRoutes.js';
import caretakerRoutes from './route/caretakerRoutes.js';
import userModel from './models/user.js';
import { verifyToken, allowUserOnly, allowCaretakerOnly } from './middleware/authMiddleware.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getEsewaPaymentHash, verifyEsewaPayment } from './models/esewa.js';
import Payment from './models/paymentModel.js';
import Item from './models/itemModel.js';
import PurchasedItem from './models/purchasedItemModel.js';

// Setup path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app
dotenv.config();
const app = express();

// Set view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/petwalk', petwalkRoutes);
app.use('/api', userRoutes);
app.use('/api', caretakerRoutes);

// Protected Routes
app.get('/homepage', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});
app.get('/services', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});
app.get('/contact', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// User Booking Routes
app.get('/pet_boarding_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pet_boarding_booking.html'));
});
app.get('/pet_sitting_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pet_sitting_booking.html'));
});
app.get('/pet_training_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pet_training_booking.html'));
});
app.get('/pet_walking_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pet_walking_booking.html'));
});
app.get('/pet_grooming_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pet_grooming_booking.html'));
});
app.get('/pet_veterinary_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pet_veterinary_booking.html'));
});

// User Dashboard Routes
app.get('/user/user_dashboard', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user', 'user_dashboard.html'));
});
app.get('/user/user_profile', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user', 'user_profile.html'));
});
app.get('/user/user_booking', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user', 'user_booking.html'));
});
app.get('/user/user_payment', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user', 'user_payment.html'));
});
app.get('/user/user_message', verifyToken, allowUserOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user', 'user_message.html'));
});

// Caretaker Dashboard Routes
app.get('/caretaker/caretaker_dashboard', verifyToken, allowCaretakerOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_dashboard.html'));
});
app.get('/caretaker/caretaker_schedule', verifyToken, allowCaretakerOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_schedule.html'));
});
app.get('/caretaker/caretaker_booking', verifyToken, allowCaretakerOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_booking.html'));
});
app.get('/caretaker/caretaker_payment', verifyToken, allowCaretakerOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_payment.html'));
});
app.get('/caretaker/caretaker_message', verifyToken, allowCaretakerOnly, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_message.html'));
});

// Static Pages
app.get('/', (req, res) => res.redirect('/login_page'));
app.get('/frontpage', (req, res) => res.sendFile(path.join(__dirname, 'public', 'frontpage.html')));
app.get('/login_page', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login_page.html')));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Verifying eSewa Payment

app.get("/complete-payment", async (req, res) => {
  const { data } = req.query; // Data received from eSewa's redirect

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the purchased item using the transaction UUID
    const purchasedItemData = await PurchasedItem.findById(
      paymentInfo.response.transaction_uuid
    );

    if (!purchasedItemData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Create a new payment record in the database
    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      productId: paymentInfo.response.transaction_uuid,
      amount: purchasedItemData.totalPrice,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });

    // Update the purchased item status to 'completed'
    await PurchasedItem.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      { $set: { status: "completed" } }
    );

    // Respond with success message
    res.json({
      success: true,
      message: "Payment successful",
      paymentData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
});

// Start Server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000/frontpage');
  });
});
 