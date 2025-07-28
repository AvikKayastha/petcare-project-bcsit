import mongoose from 'mongoose';

const petwalkSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    petName: { 
      type: String, 
      required: [true, 'Pet name is required'],
      trim: true 
    },
    petType: { 
      type: String, 
      required: [true, 'Pet type is required'],
      enum: ['dog', 'cat'],
      lowercase: true
    },
    date: { 
      type: Date, 
      required: [true, 'Booking date is required'],
      validate: {
        validator: function(value) {
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: 'Booking date cannot be in the past'
      }
    },
    hours: { 
      type: Number, 
      required: [true, 'Number of hours is required'],
      min: [1, 'Minimum 1 hour required'],
      max: [8, 'Maximum 8 hours allowed']
    },
    notes: { 
      type: String, 
      trim: true,
      maxLength: [500, 'Notes cannot exceed 500 characters']
    },
    totalPrice: { 
      type: Number, 
      required: true,
      default: function() {
        return this.hours * 100; // 100 per hour, adjust as needed
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Will be set from auth middleware
    }
  },
  { 
    timestamps: true 
  }
);

// Calculate total price before saving
petwalkSchema.pre('save', function(next) {
  if (this.hours) {
    this.totalPrice = this.hours * 100; // 100 per hour base rate
  }
  next();
});

const Petwalk = mongoose.model('Petwalk', petwalkSchema);
export default Petwalk;