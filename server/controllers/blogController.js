const Blog = require('../models/Blog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all blogs
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  let query = Blog.find(JSON.parse(queryStr));

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
  const blogs = await query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs
    }
  });
});

// Get blog by ID or slug
exports.getBlog = catchAsync(async (req, res, next) => {
  let blog;
  
  // Check if the parameter is an ObjectId
  const isValidId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
  
  if (isValidId) {
    blog = await Blog.findById(req.params.id);
  } else {
    // If not a valid ID, try to find by slug
    blog = await Blog.findOne({ slug: req.params.id });
  }

  if (!blog) {
    return next(new AppError('No blog found with that ID or slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  });
});

// Create new blog - Admin only
exports.createBlog = catchAsync(async (req, res, next) => {
  // Set author to current user
  req.body.author = req.user.id;
  
  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      blog: newBlog
    }
  });
});

// Update blog - Admin only
exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!blog) {
    return next(new AppError('No blog found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog
    }
  });
});

// Delete blog - Admin only
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new AppError('No blog found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get blogs by category
exports.getBlogsByCategory = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({ category: req.params.category });

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs
    }
  });
});

// Get featured blogs
exports.getFeaturedBlogs = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 3;
  const blogs = await Blog.find({ featured: true }).limit(limit);

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs
    }
  });
});

// Search blogs
exports.searchBlogs = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  
  if (!query) {
    return next(new AppError('Please provide a search query', 400));
  }
  
  const blogs = await Blog.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { summary: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  });
  
  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs
    }
  });
});
