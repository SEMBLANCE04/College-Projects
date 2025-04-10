const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A package must have a name'],
      unique: true,
      trim: true
    },
    destination: {
      type: mongoose.Schema.ObjectId,
      ref: 'Destination',
      required: [true, 'A package must belong to a destination']
    },
    duration: {
      type: Number,
      required: [true, 'A package must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A package must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A package must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult'
      }
    },
    price: {
      type: Number,
      required: [true, 'A package must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A package must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A package must have a cover image']
    },
    images: [String],
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
        activities: [String],
        accommodation: String,
        meals: {
          breakfast: Boolean,
          lunch: Boolean,
          dinner: Boolean
        }
      }
    ],
    startDates: [Date],
    inclusions: [String],
    exclusions: [String],
    featured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
packageSchema.index({ price: 1, rating: -1 });
packageSchema.index({ destination: 1 });

// Virtual populate for reviews
packageSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'package',
  localField: '_id'
});

// Middleware to populate destination on find
packageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'destination',
    select: 'name country'
  });
  this.find({ active: { $ne: false } });
  next();
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
