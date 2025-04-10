const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/checkout-success', bookingController.createBookingCheckout);

// Protected routes
router.use(authController.protect);

router.get('/my-bookings', bookingController.getMyBookings);
router.post('/checkout-session/:packageId', bookingController.getCheckoutSession);
router.patch('/cancel/:id', bookingController.cancelBooking);

// Admin only routes
router.use(authController.restrictTo('admin'));

router.route('/')
  .get(bookingController.getAllBookings);

router.route('/stats')
  .get(bookingController.getBookingStats);

router.route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking);

module.exports = router;
