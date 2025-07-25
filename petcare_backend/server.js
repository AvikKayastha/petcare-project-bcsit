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
app.get('/user/user_dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'user_dashboard.html')));
app.get('/user/profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'profile.html')));
app.get('/user/bookings', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'bookings.html')));
app.get('/user/payments', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'payments.html')));
app.get('/user/messages', (req, res) => res.sendFile(path.join(__dirname, 'public', 'user', 'messages.html')));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});
