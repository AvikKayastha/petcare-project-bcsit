import mongoose from 'mongoose';

const petgroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pet_name: {
    type: String,
    required: true,
  },
  pet_type: {
    type: String,
    required: true,
  },
  date: {
    type: date,
    required: true,
  },
  session: {
    type: number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const grooming = mongoose.model('grooming', petgroomSchema );

export default grooming;