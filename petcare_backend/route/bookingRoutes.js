import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Admin Dashboard – Recent 4 Bookings
router.get('/adminDasboard', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 }).limit(4);
    const recentBookings = bookings.map(b => ({
      name: b.name,
      email: b.email,
      petName: b.petName,
      petType: b.petType,
      date: b.date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      hours: b.hours,
    }));
    res.render('admin-dashboard', { recentBookings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//Admin Bookings Page
router.get('/bookings-admin', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: -1 });

    const formattedBookings = bookings.map(b => ({
      name: b.name,
      email: b.email,
      petName: b.petName,
      petType: b.petType,
      date: b.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      hours: b.hours,
    }));

    res.render('admin-bookings', { bookings: formattedBookings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//save booking
router.post('/booking', async (req, res) => {
  const { name, email, petName, petType, date, hours } = req.body;

  try {
    const newBooking = new Booking({ name, email, petName, petType, date, hours });
    await newBooking.save();
    res.redirect('/success'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save booking');
  }
});

export default router;
