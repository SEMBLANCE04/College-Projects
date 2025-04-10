const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create payment intent
exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { amount, currency = 'usd', bookingId } = req.body;

  if (!amount) {
    return next(new AppError('Please provide an amount', 400));
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    metadata: {
      bookingId,
      userId: req.user.id
    }
  });

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret
  });
});

// Webhook handler for Stripe events
exports.webhookHandler = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  const { bookingId } = paymentIntent.metadata;
  
  if (bookingId) {
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'paid',
      paymentId: paymentIntent.id
    });
  }
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  const { bookingId } = paymentIntent.metadata;
  
  if (bookingId) {
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'failed'
    });
  }
};

// Get payment methods for user
exports.getPaymentMethods = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user.stripeCustomerId) {
    return res.status(200).json({
      status: 'success',
      data: {
        paymentMethods: []
      }
    });
  }
  
  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: 'card'
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      paymentMethods: paymentMethods.data
    }
  });
});

// Add payment method for user
exports.addPaymentMethod = catchAsync(async (req, res, next) => {
  const { paymentMethodId } = req.body;
  
  if (!paymentMethodId) {
    return next(new AppError('Please provide a payment method ID', 400));
  }
  
  let user = await User.findById(req.user.id);
  
  // If user doesn't have a Stripe customer ID, create one
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name
    });
    
    user = await User.findByIdAndUpdate(
      req.user.id,
      { stripeCustomerId: customer.id },
      { new: true }
    );
  }
  
  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: user.stripeCustomerId
  });
  
  // Set as default payment method
  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Payment method added successfully'
  });
});

// Remove payment method
exports.removePaymentMethod = catchAsync(async (req, res, next) => {
  const { paymentMethodId } = req.params;
  
  if (!paymentMethodId) {
    return next(new AppError('Please provide a payment method ID', 400));
  }
  
  const user = await User.findById(req.user.id);
  
  if (!user.stripeCustomerId) {
    return next(new AppError('No payment methods found', 404));
  }
  
  // Detach payment method from customer
  await stripe.paymentMethods.detach(paymentMethodId);
  
  res.status(200).json({
    status: 'success',
    message: 'Payment method removed successfully'
  });
});
