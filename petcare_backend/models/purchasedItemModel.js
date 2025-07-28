import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const purchasedItemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['esewa', 'khalti'], required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const PurchasedItem = model('PurchasedItem', purchasedItemSchema);
export default PurchasedItem;