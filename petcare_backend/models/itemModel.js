import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
    category: { type: String },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
export default Item; // ✅ ES Module export
