const mongoose = require('mongoose');
const Package = require('./Package');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Review must have a rating']
    },
    package: {
      type: mongoose.Schema.ObjectId,
      ref: 'Package',
      required: [true, 'Review must belong to a package']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    photos: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate reviews from the same user on the same package
reviewSchema.index({ package: 1, user: 1 }, { unique: true });

// Middleware to populate user on find
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  
  this.find({ active: { $ne: false } });
  next();
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function(packageId) {
  const stats = await this.aggregate([
    {
      $match: { package: packageId, active: { $ne: false } }
    },
    {
      $group: {
        _id: '$package',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Package.findByIdAndUpdate(packageId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Package.findByIdAndUpdate(packageId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5 // Default value
    });
  }
};

// Call calcAverageRatings after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.package);
});

// Call calcAverageRatings before findOneAndUpdate/Delete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.package);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
