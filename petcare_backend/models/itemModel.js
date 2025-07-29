import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    petName: { type: String, required: true },
    petType: { type: String, required: true, enum:['dog','cat']  },
    date: { type: Date, required: true },
    hours: { type: Date, required: true, },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
export default Item; // ✅ ES Module export
