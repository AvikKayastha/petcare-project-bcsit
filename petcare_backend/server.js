import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contactRoutes from './route/contactRoutes.js';
import petwalkRoutes from './route/petwalkRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/petwalk', petwalkRoutes);

// Clean URL routes
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

// Start the server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});
