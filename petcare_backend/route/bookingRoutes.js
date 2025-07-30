import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

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

router.post('/booking', async (req, res) => {
  const { name, email, petName, petType, date, hours } = req.body;

  try {
    const newBooking = new Booking({ name, email, petName, petType, date, hours });
    await newBooking.save();
    res.redirect('/success'); // You can change this to your actual success page or route
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save booking');
  }
});

export default router;
