const Package = require('../models/Package');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all packages
exports.getAllPackages = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Package.find(JSON.parse(queryStr));

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
  const packages = await query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: packages.length,
    data: {
      packages
    }
  });
});

// Get package by ID
exports.getPackage = catchAsync(async (req, res, next) => {
  const package = await Package.findById(req.params.id)
    .populate('reviews')
    .populate({
      path: 'destination',
      select: 'name country description'
    });

  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      package
    }
  });
});

// Create new package - Admin only
exports.createPackage = catchAsync(async (req, res, next) => {
  const newPackage = await Package.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      package: newPackage
    }
  });
});

// Update package - Admin only
exports.updatePackage = catchAsync(async (req, res, next) => {
  const package = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      package
    }
  });
});

// Delete package - Admin only
exports.deletePackage = catchAsync(async (req, res, next) => {
  const package = await Package.findByIdAndDelete(req.params.id);

  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get featured packages
exports.getFeaturedPackages = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 6;
  const packages = await Package.find({ featured: true })
    .limit(limit)
    .sort('-price')
    .populate({
      path: 'destination',
      select: 'name country'
    });

  res.status(200).json({
    status: 'success',
    results: packages.length,
    data: {
      packages
    }
  });
});

// Get top 5 cheap packages
exports.getTopCheapPackages = catchAsync(async (req, res, next) => {
  const packages = await Package.find()
    .sort('price')
    .limit(5)
    .populate({
      path: 'destination',
      select: 'name country'
    });

  res.status(200).json({
    status: 'success',
    results: packages.length,
    data: {
      packages
    }
  });
});

// Get packages by destination
exports.getPackagesByDestination = catchAsync(async (req, res, next) => {
  const packages = await Package.find({ destination: req.params.destinationId });

  res.status(200).json({
    status: 'success',
    results: packages.length,
    data: {
      packages
    }
  });
});

// Get package stats
exports.getPackageStats = catchAsync(async (req, res, next) => {
  const stats = await Package.aggregate([
    {
      $match: { price: { $gte: 0 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numPackages: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
