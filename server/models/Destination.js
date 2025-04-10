const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A destination must have a name'],
      unique: true,
      trim: true
    },
    country: {
      type: String,
      required: [true, 'A destination must have a country'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A destination must have a description'],
      trim: true
    },
    images: [String],
    coverImage: String,
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number], // [longitude, latitude]
      address: String
    },
    popularityIndex: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    highlights: [String],
    imageUrl: String,
    travelSeason: String,
    budget: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for geospatial queries
destinationSchema.index({ location: '2dsphere' });

// Virtual populate for packages
destinationSchema.virtual('packages', {
  ref: 'Package',
  foreignField: 'destination',
  localField: '_id'
});

// Filter out inactive destinations
destinationSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
