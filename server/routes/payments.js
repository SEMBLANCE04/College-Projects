const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Stripe webhook - needs raw body
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.webhookHandler
);

// Protected routes
router.use(authController.protect);

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.get('/payment-methods', paymentController.getPaymentMethods);
router.post('/payment-methods', paymentController.addPaymentMethod);
router.delete('/payment-methods/:paymentMethodId', paymentController.removePaymentMethod);

module.exports = router;
