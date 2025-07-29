import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contactRoutes from './route/contactRoutes.js';
import petsittingRoutes from './route/petsittingRoutes.js';
import petgroomingRoutes from './route/petgroomingRoutes.js';
import pettrainingRoutes from './route/pettrainingRoutes.js';
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
app.use('/api/petsitting', petsittingRoutes);
app.use('/api/petgrooming', petgroomingRoutes);
app.use('/api/pettraining', pettrainingRoutes);
// HTML route
app.get('/pet_sitting_booking', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'pet_sitting_booking.html'))
);
app.get('/pet_grooming_booking', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'pet_grooming_booking.html'))
);
app.get('/pet_training_booking', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'pet_training_booking.html'))
);


// Start server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});
