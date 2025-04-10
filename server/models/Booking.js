const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.ObjectId,
      ref: 'Package',
      required: [true, 'Booking must belong to a package']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    startDate: {
      type: Date,
      required: [true, 'Booking must have a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Booking must have an end date']
    },
    travelers: {
      adults: {
        type: Number,
        required: [true, 'Booking must have number of adults'],
        min: 1
      },
      children: {
        type: Number,
        default: 0
      }
    },
    additionalServices: [
      {
        name: String,
        price: Number,
        description: String
      }
    ],
    specialRequests: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'cash'],
      default: 'credit_card'
    },
    paymentId: String,
    totalAmount: {
      type: Number,
      required: [true, 'Booking must have a total amount']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
bookingSchema.index({ package: 1, user: 1 });
bookingSchema.index({ startDate: 1 });
bookingSchema.index({ status: 1 });

// Middleware to populate package and user on find
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'package',
    select: 'name duration imageCover'
  }).populate({
    path: 'user',
    select: 'name email'
  });
  next();
});

// Calculate duration
bookingSchema.virtual('duration').get(function() {
  return Math.ceil(
    (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
  );
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
