const express = require('express');
const packageController = require('../controllers/packageController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviews');

const router = express.Router();

// Redirect to review router if route includes reviews
router.use('/:packageId/reviews', reviewRouter);

// Public routes
router.get('/', packageController.getAllPackages);
router.get('/top-cheap', packageController.getTopCheapPackages);
router.get('/featured', packageController.getFeaturedPackages);
router.get('/stats', packageController.getPackageStats);
router.get('/destination/:destinationId', packageController.getPackagesByDestination);
router.get('/:id', packageController.getPackage);

// Protected routes - Admin only
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/')
  .post(packageController.createPackage);

router.route('/:id')
  .patch(packageController.updatePackage)
  .delete(packageController.deletePackage);

module.exports = router;
