const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Set package and user IDs for nested routes
exports.setPackageUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.package) req.body.package = req.params.packageId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.packageId) filter = { package: req.params.packageId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// Get review by ID
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Create new review
exports.createReview = catchAsync(async (req, res, next) => {
  // Check if user has already reviewed this package
  const existingReview = await Review.findOne({
    user: req.user.id,
    package: req.body.package
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this package', 400));
  }

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

// Update review
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user is the owner of the review or an admin
  if (review.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only update your own reviews', 403));
  }

  const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      review: updatedReview
    }
  });
});

// Delete review
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user is the owner of the review or an admin
  if (review.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own reviews', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get user reviews
exports.getUserReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});
