import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Root Route
app.get('/', (req, res) => {
  res.send('✅ Server is running');
  const contactRoutes = require('./routes/contactRoutes');
  app.use('/api/contact', contactRoutes);
});


// Connect to DB and start server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log('🚀 Server running at http://localhost:5000');
  });
});