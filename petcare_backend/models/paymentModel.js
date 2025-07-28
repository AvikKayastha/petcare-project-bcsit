import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    transactionId: { type: String, unique: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'PurchasedItem',
      required: true,
    },
    amount: { type: Number, required: true },
    dataFromVerificationReq: { type: Object },
    apiQueryFromUser: { type: Object },
    paymentGateway: {
      type: String,
      enum: ['khalti', 'esewa', 'connectIps'],
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'pending',
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = model('Payment', paymentSchema);
export default Payment;