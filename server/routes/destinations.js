const express = require('express');
const destinationController = require('../controllers/destinationController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', destinationController.getAllDestinations);
router.get('/featured', destinationController.getFeaturedDestinations);
router.get('/country/:country', destinationController.getDestinationsByCountry);
router.get('/stats', destinationController.getDestinationStats);
router.get('/:id', destinationController.getDestination);

// Protected routes - Admin only
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/')
  .post(destinationController.createDestination);

router.route('/:id')
  .patch(destinationController.updateDestination)
  .delete(destinationController.deleteDestination);

module.exports = router;
