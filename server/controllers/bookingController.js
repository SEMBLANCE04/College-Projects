const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../utils/email');

// Get all bookings - Admin only
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get user bookings
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get booking by ID
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user is the owner of the booking or an admin
  if (booking.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only view your own bookings', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Create checkout session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked package
  const package = await Package.findById(req.params.packageId);

  if (!package) {
    return next(new AppError('No package found with that ID', 404));
  }

  // 2) Calculate total price based on travelers and additional services
  const { startDate, endDate, travelers, additionalServices } = req.body;

  if (!startDate || !endDate || !travelers) {
    return next(new AppError('Please provide startDate, endDate, and travelers', 400));
  }

  // Calculate base price
  const basePrice = package.price * travelers.adults + (package.price * 0.7 * travelers.children);
  
  // Calculate additional services price
  let additionalServicesPrice = 0;
  if (additionalServices && additionalServices.length > 0) {
    additionalServicesPrice = additionalServices.reduce((total, service) => total + service.price, 0);
  }

  const totalAmount = basePrice + additionalServicesPrice;

  // 3) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${process.env.CLIENT_URL}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/packages/${package.id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.packageId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${package.name} Tour`,
            description: package.summary,
            images: [package.imageCover],
          },
          unit_amount: Math.round(totalAmount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      startDate,
      endDate,
      adults: travelers.adults,
      children: travelers.children || 0,
      additionalServices: JSON.stringify(additionalServices || []),
      specialRequests: req.body.specialRequests || ''
    }
  });

  // 4) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

// Create booking after successful payment
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { session_id } = req.query;
  
  if (!session_id) return next();

  // Get the session
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== 'paid') {
    return next(new AppError('Payment not successful', 400));
  }

  // Get data from session
  const packageId = session.client_reference_id;
  const userId = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100; // Convert from cents
  
  // Get metadata
  const { startDate, endDate, adults, children, additionalServices, specialRequests } = session.metadata;
  
  // Create booking
  const booking = await Booking.create({
    package: packageId,
    user: userId,
    price,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    travelers: {
      adults: parseInt(adults),
      children: parseInt(children)
    },
    additionalServices: JSON.parse(additionalServices),
    specialRequests,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    paymentId: session.payment_intent,
    totalAmount: price
  });

  // Send confirmation email
  const user = await User.findById(userId);
  const package = await Package.findById(packageId);
  
  await sendEmail({
    email: user.email,
    subject: 'Booking Confirmation - Travel Agency',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${user.name},</p>
      <p>Thank you for booking with us! Your booking for <strong>${package.name}</strong> has been confirmed.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Package: ${package.name}</li>
        <li>Start Date: ${new Date(startDate).toLocaleDateString()}</li>
        <li>End Date: ${new Date(endDate).toLocaleDateString()}</li>
        <li>Travelers: ${adults} adults, ${children} children</li>
        <li>Total Amount: $${price}</li>
      </ul>
      <p>We're looking forward to providing you with an amazing travel experience!</p>
      <p>Best regards,<br>Travel Agency Team</p>
    `
  });

  res.redirect(`${process.env.CLIENT_URL}/bookings/${booking._id}`);
});

// Update booking - Admin only
exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Send email notification about booking update
  const user = await User.findById(booking.user);
  
  await sendEmail({
    email: user.email,
    subject: 'Booking Update - Travel Agency',
    html: `
      <h1>Booking Update</h1>
      <p>Dear ${user.name},</p>
      <p>Your booking status has been updated to <strong>${booking.status}</strong>.</p>
      <p>If you have any questions, please contact our customer support.</p>
      <p>Best regards,<br>Travel Agency Team</p>
    `
  });

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Cancel booking
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user is the owner of the booking or an admin
  if (booking.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only cancel your own bookings', 403));
  }

  // Check if booking is already cancelled
  if (booking.status === 'cancelled') {
    return next(new AppError('This booking is already cancelled', 400));
  }

  // Update booking status
  booking.status = 'cancelled';
  await booking.save();

  // Send email notification about booking cancellation
  const user = await User.findById(booking.user);
  
  await sendEmail({
    email: user.email,
    subject: 'Booking Cancellation - Travel Agency',
    html: `
      <h1>Booking Cancellation</h1>
      <p>Dear ${user.name},</p>
      <p>Your booking has been cancelled as requested.</p>
      <p>If you have any questions, please contact our customer support.</p>
      <p>Best regards,<br>Travel Agency Team</p>
    `
  });

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Get booking stats - Admin only
exports.getBookingStats = catchAsync(async (req, res, next) => {
  const stats = await Booking.aggregate([
    {
      $match: { status: { $ne: 'cancelled' } }
    },
    {
      $group: {
        _id: { $month: '$startDate' },
        numBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { month: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
