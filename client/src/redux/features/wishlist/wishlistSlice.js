import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Get user's wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/getWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/users/wishlist');
      return res.data.data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

// Add package to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (packageId, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/users/wishlist', { packageId });
      return res.data.data.wishlist;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add to wishlist'
      );
    }
  }
);

// Remove package from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (packageId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/users/wishlist/${packageId}`);
      return { packageId, wishlist: res.data.data.wishlist };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to remove from wishlist'
      );
    }
  }
);

// Initial state
const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.loading = false;
        toast.success('Added to wishlist!');
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload.wishlist;
        state.loading = false;
        toast.success('Removed from wishlist!');
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;

export default wishlistSlice.reducer;
