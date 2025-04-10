const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/:id', blogController.getBlog);

// Protected routes - Admin only
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/')
  .post(blogController.createBlog);

router.route('/:id')
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
