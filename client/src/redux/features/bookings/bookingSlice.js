import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Get user bookings
export const getMyBookings = createAsyncThunk(
  'bookings/getMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/bookings/my-bookings');
      return res.data.data.bookings;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

// Get booking by ID
export const getBooking = createAsyncThunk(
  'bookings/getBooking',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/bookings/${id}`);
      return res.data.data.booking;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch booking'
      );
    }
  }
);

// Create checkout session
export const createCheckoutSession = createAsyncThunk(
  'bookings/createCheckoutSession',
  async ({ packageId, bookingData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/api/bookings/checkout-session/${packageId}`,
        bookingData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create checkout session'
      );
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/bookings/cancel/${id}`);
      return res.data.data.booking;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

// Get all bookings (Admin only)
export const getAllBookings = createAsyncThunk(
  'bookings/getAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/bookings');
      return res.data.data.bookings;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch all bookings'
      );
    }
  }
);

// Update booking (Admin only)
export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/bookings/${id}`, bookingData);
      return res.data.data.booking;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update booking'
      );
    }
  }
);

// Get booking stats (Admin only)
export const getBookingStats = createAsyncThunk(
  'bookings/getBookingStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/bookings/stats');
      return res.data.data.stats;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch booking stats'
      );
    }
  }
);

// Initial state
const initialState = {
  bookings: [],
  booking: null,
  checkoutSession: null,
  stats: [],
  loading: false,
  error: null,
};

// Bookings slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.booking = null;
    },
    clearCheckoutSession: (state) => {
      state.checkoutSession = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user bookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get booking by ID
      .addCase(getBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.booking = action.payload;
        state.loading = false;
      })
      .addCase(getBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Create checkout session
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.checkoutSession = action.payload;
        state.loading = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
        state.booking = action.payload;
        state.loading = false;
        toast.success('Booking cancelled successfully!');
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get all bookings (Admin only)
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Update booking (Admin only)
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
        state.booking = action.payload;
        state.loading = false;
        toast.success('Booking updated successfully!');
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get booking stats (Admin only)
      .addCase(getBookingStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(getBookingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBooking, clearCheckoutSession, clearError } = bookingSlice.actions;

export default bookingSlice.reducer;
