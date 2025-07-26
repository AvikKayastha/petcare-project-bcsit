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
import userModel from './models/user.js'; 
import { verifyToken } from './middleware/authMiddleware.js';


// ES module path setup
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Token generators
function generateAccessToken(user) {
  return jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5m' });
}
function generateRefreshToken(user) {
  return jwt.sign({ email: user.email }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
}

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/petwalk', petwalkRoutes);
app.use('/api', userRoutes);

//protected routes
app.get('/homepage', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});
app.get('/services', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'services.html'));
});
app.get('/contact', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
app.get('/pet_boarding_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pet_boarding_booking.html'));
});
app.get('/pet_sitting_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pet_sitting_booking.html'));
});
app.get('/pet_training_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pet_training_booking.html'));
});
app.get('/pet_walking_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pet_walking_booking.html'));    
});
app.get('/pet_grooming_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pet_grooming_booking.html'));
});
app.get('/pet_veterinary_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pet_veterinary_booking.html'));
}); 
app.get('/user/user_dashboard', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'user', 'user_dashboard.html'));
});
app.get('/user/user_profile', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'user', 'user_profile.html'));
});
app.get('/user/user_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'user', 'user_booking.html'));
});
app.get('/user/user_payment', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'user', 'user_payment.html'));
});
app.get('/user/user_message', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'user', 'user_message.html'));
});
app.get('/caretaker/caretaker_dashboard', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_dashboard.html'));
});
app.get('/caretaker/caretaker_schedule', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_schedule.html'));
});
app.get('/caretaker/caretaker_booking', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_booking.html'));
});
app.get('/caretaker/caretaker_payment', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_payment.html'));
});
app.get('/caretaker/caretaker_message', verifyToken, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_message.html'));
});

// Static Page Routes (Clean URL)
app.get('/', (req, res) => res.redirect('/login'));
app.get('/homepage', (req, res) => res.sendFile(path.join(__dirname, 'public', 'homepage.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'public', 'services.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/frontpage', (req, res) => res.sendFile(path.join(__dirname, 'public', 'frontpage.html')));
app.get('/pet_boarding_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pet_boarding_booking.html')));
app.get('/pet_sitting_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pet_sitting_booking.html')));
app.get('/pet_training_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pet_training_booking.html')));
app.get('/pet_walking_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pet_walking_booking.html')));
app.get('/pet_grooming_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pet_grooming_booking.html')));
app.get('/pet_veterinary_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pet_veterinary_booking.html')));
app.get('/login_page', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login_page.html')));
app.get('/user_dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'user_dashboard.html')));
app.get('/user_profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'user_profile.html')));
app.get('/user_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'user_booking.html')));
app.get('/user_payment', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'user_payment.html')));
app.get('/user_message', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'user_message.html')));
app.get('/caretaker_dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_dashboard.html')));
app.get('/caretaker_schedule', (req, res) => res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_schedule.html')));
app.get('/caretaker_booking', (req, res) => res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_booking.html')));
app.get('/caretaker_payment', (req, res) => res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_payment.html'))); 
app.get('/caretaker_message', (req, res) => res.sendFile(path.join(__dirname, 'public', 'caretaker', 'caretaker_message.html')));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000/frontpage');
  });
});
