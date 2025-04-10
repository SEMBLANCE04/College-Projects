import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Get all destinations
export const getDestinations = createAsyncThunk(
  'destinations/getDestinations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/destinations');
      return res.data.data.destinations;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch destinations'
      );
    }
  }
);

// Get featured destinations
export const getFeaturedDestinations = createAsyncThunk(
  'destinations/getFeaturedDestinations',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/destinations/featured?limit=${limit}`);
      return res.data.data.destinations;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch featured destinations'
      );
    }
  }
);

// Get destination by ID
export const getDestination = createAsyncThunk(
  'destinations/getDestination',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/destinations/${id}`);
      return res.data.data.destination;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch destination'
      );
    }
  }
);

// Get destinations by country
export const getDestinationsByCountry = createAsyncThunk(
  'destinations/getDestinationsByCountry',
  async (country, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/destinations/country/${country}`);
      return res.data.data.destinations;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch destinations by country'
      );
    }
  }
);

// Create destination (Admin only)
export const createDestination = createAsyncThunk(
  'destinations/createDestination',
  async (destinationData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/destinations', destinationData);
      return res.data.data.destination;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create destination'
      );
    }
  }
);

// Update destination (Admin only)
export const updateDestination = createAsyncThunk(
  'destinations/updateDestination',
  async ({ id, destinationData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/destinations/${id}`, destinationData);
      return res.data.data.destination;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update destination'
      );
    }
  }
);

// Delete destination (Admin only)
export const deleteDestination = createAsyncThunk(
  'destinations/deleteDestination',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/destinations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete destination'
      );
    }
  }
);

// Initial state
const initialState = {
  destinations: [],
  featuredDestinations: [],
  destination: null,
  loading: false,
  error: null,
};

// Destinations slice
const destinationSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    clearDestination: (state) => {
      state.destination = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all destinations
      .addCase(getDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDestinations.fulfilled, (state, action) => {
        state.destinations = action.payload;
        state.loading = false;
      })
      .addCase(getDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get featured destinations
      .addCase(getFeaturedDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedDestinations.fulfilled, (state, action) => {
        state.featuredDestinations = action.payload;
        state.loading = false;
      })
      .addCase(getFeaturedDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get destination by ID
      .addCase(getDestination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDestination.fulfilled, (state, action) => {
        state.destination = action.payload;
        state.loading = false;
      })
      .addCase(getDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get destinations by country
      .addCase(getDestinationsByCountry.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDestinationsByCountry.fulfilled, (state, action) => {
        state.destinations = action.payload;
        state.loading = false;
      })
      .addCase(getDestinationsByCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create destination
      .addCase(createDestination.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDestination.fulfilled, (state, action) => {
        state.destinations.push(action.payload);
        state.loading = false;
        toast.success('Destination created successfully!');
      })
      .addCase(createDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Update destination
      .addCase(updateDestination.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.destinations = state.destinations.map((destination) =>
          destination._id === action.payload._id ? action.payload : destination
        );
        state.destination = action.payload;
        state.loading = false;
        toast.success('Destination updated successfully!');
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Delete destination
      .addCase(deleteDestination.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.destinations = state.destinations.filter(
          (destination) => destination._id !== action.payload
        );
        state.loading = false;
        toast.success('Destination deleted successfully!');
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearDestination, clearError } = destinationSlice.actions;

export default destinationSlice.reducer;
