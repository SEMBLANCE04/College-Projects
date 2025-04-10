const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReview);

// Protected routes
router.use(authController.protect);

router.get('/user/my-reviews', reviewController.getUserReviews);

router.route('/')
  .post(
    reviewController.setPackageUserIds,
    reviewController.createReview
  );

router.route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
