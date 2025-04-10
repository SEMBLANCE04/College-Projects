const Destination = require('../models/Destination');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all destinations
exports.getAllDestinations = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Destination.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const destinations = await query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: {
      destinations
    }
  });
});

// Get destination by ID
exports.getDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id).populate('packages');

  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      destination
    }
  });
});

// Create new destination - Admin only
exports.createDestination = catchAsync(async (req, res, next) => {
  const newDestination = await Destination.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      destination: newDestination
    }
  });
});

// Update destination - Admin only
exports.updateDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      destination
    }
  });
});

// Delete destination - Admin only
exports.deleteDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findByIdAndDelete(req.params.id);

  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get featured destinations
exports.getFeaturedDestinations = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 6;
  const destinations = await Destination.find({ isFeatured: true })
    .limit(limit)
    .sort('-rating');

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: {
      destinations
    }
  });
});

// Get destinations by country
exports.getDestinationsByCountry = catchAsync(async (req, res, next) => {
  const destinations = await Destination.find({ country: req.params.country });

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: {
      destinations
    }
  });
});

// Get destinations stats
exports.getDestinationStats = catchAsync(async (req, res, next) => {
  const stats = await Destination.aggregate([
    {
      $match: { popularityIndex: { $gte: 0 } }
    },
    {
      $group: {
        _id: '$country',
        numDestinations: { $sum: 1 },
        avgPopularity: { $avg: '$popularityIndex' }
      }
    },
    {
      $sort: { avgPopularity: -1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
