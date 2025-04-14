import axios from 'axios';

export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create booking');
  }
};

export const sendBookingConfirmationEmail = async (bookingDetails) => {
  try {
    const response = await axios.post('/api/bookings/send-confirmation', bookingDetails);
    return response.data;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't throw error here as this is not critical for the booking process
  }
};
