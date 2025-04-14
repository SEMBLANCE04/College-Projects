const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QRCode = require('qrcode');
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

// Create new booking
exports.createBooking = async (req, res, next) => {
  try {
    // 1) Get the package
    const package = await Package.findById(req.params.packageId);
    if (!package) {
      return res.status(404).json({
        status: 'error',
        message: 'Package not found'
      });
    }

    // 2) Get booking details
    const { travelDate, numberOfTravelers } = req.body;
    if (!travelDate || !numberOfTravelers) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide travel date and number of travelers'
      });
    }

    // 3) Calculate total price
    const totalAmount = package.price * numberOfTravelers;

    // 4) Create booking
    const booking = await Booking.create({
      package: package.id,
      user: req.user.id,
      price: package.price,
      totalAmount: totalAmount,
      startDate: new Date(travelDate),
      endDate: new Date(travelDate), // For single day packages
      travelers: {
        adults: numberOfTravelers,
        children: 0
      },
      status: 'confirmed',
      paymentStatus: 'pending',
      bookingReference: Math.random().toString(36).substring(2, 10).toUpperCase()
    });

    // 5) Generate QR code
    const qrData = JSON.stringify({
      bookingId: booking._id,
      package: package.title,
      date: travelDate,
      travelers: numberOfTravelers,
      amount: totalAmount,
      reference: booking.bookingReference
    });

    const qrCode = await QRCode.toDataURL(qrData);

    res.status(201).json({
      status: 'success',
      data: {
        booking,
        qrCode,
        paymentDetails: {
          amount: totalAmount,
          reference: booking.bookingReference,
          accountName: 'Travel Agency',
          accountNumber: '1234567890',
          bankName: 'Example Bank'
        }
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating booking'
    });
  }
};

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
