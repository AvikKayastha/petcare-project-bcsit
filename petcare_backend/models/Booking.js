import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },       // customer name
  email: { type: String, required: true },      // customer email
  petName: { type: String, required: true },    // pet name
  petType: { type: String, required: true },    // pet type
  date: { type: Date, required: true },         // booking date
  hours: { type: String, required: true },       // booking hour/time
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
