const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Filter out unwanted fields from req.body
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get all users - Admin only
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Get current user profile
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('bookings');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update current user profile
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    );
  }

  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'photo',
    'phoneNumber',
    'address'
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Delete (deactivate) current user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get user by ID - Admin only
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update user - Admin only
exports.updateUser = catchAsync(async (req, res, next) => {
  // Do NOT update passwords with this!
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'photo',
    'phoneNumber',
    'address',
    'role'
  );

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Delete user - Admin only
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Add destination to wishlist
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { packageId } = req.body;
  
  // Check if package exists in the user's wishlist
  const user = await User.findById(req.user.id);
  
  if (user.wishlist.includes(packageId)) {
    return next(new AppError('Package already in wishlist', 400));
  }
  
  // Add package to wishlist
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { wishlist: packageId } },
    { new: true }
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      wishlist: updatedUser.wishlist
    }
  });
});

// Remove destination from wishlist
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { packageId } = req.params;
  
  // Remove package from wishlist
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { wishlist: packageId } },
    { new: true }
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      wishlist: updatedUser.wishlist
    }
  });
});

// Get user's wishlist
exports.getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'wishlist',
    select: 'name price imageCover duration destination'
  });
  
  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: {
      wishlist: user.wishlist
    }
  });
});
