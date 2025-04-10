import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Get all reviews
export const getAllReviews = createAsyncThunk(
  'reviews/getAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/reviews');
      return res.data.data.reviews;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch reviews'
      );
    }
  }
);

// Get reviews by package
export const getReviewsByPackage = createAsyncThunk(
  'reviews/getReviewsByPackage',
  async (packageId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/packages/${packageId}/reviews`);
      return res.data.data.reviews;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch reviews for this package'
      );
    }
  }
);

// Get user reviews
export const getUserReviews = createAsyncThunk(
  'reviews/getUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/reviews/user/my-reviews');
      return res.data.data.reviews;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch your reviews'
      );
    }
  }
);

// Create review
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ packageId, reviewData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/packages/${packageId}/reviews`, {
        ...reviewData,
        package: packageId
      });
      return res.data.data.review;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create review'
      );
    }
  }
);

// Update review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/reviews/${reviewId}`, reviewData);
      return res.data.data.review;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update review'
      );
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      return reviewId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete review'
      );
    }
  }
);

// Initial state
const initialState = {
  reviews: [],
  packageReviews: [],
  userReviews: [],
  loading: false,
  error: null,
};

// Reviews slice
const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.packageReviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all reviews
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.loading = false;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get reviews by package
      .addCase(getReviewsByPackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsByPackage.fulfilled, (state, action) => {
        state.packageReviews = action.payload;
        state.loading = false;
      })
      .addCase(getReviewsByPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user reviews
      .addCase(getUserReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.userReviews = action.payload;
        state.loading = false;
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.packageReviews.push(action.payload);
        state.userReviews.push(action.payload);
        state.loading = false;
        toast.success('Review submitted successfully!');
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        // Update in packageReviews
        state.packageReviews = state.packageReviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        );
        
        // Update in userReviews
        state.userReviews = state.userReviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        );
        
        // Update in all reviews if exists
        state.reviews = state.reviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        );
        
        state.loading = false;
        toast.success('Review updated successfully!');
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        // Remove from packageReviews
        state.packageReviews = state.packageReviews.filter(
          (review) => review._id !== action.payload
        );
        
        // Remove from userReviews
        state.userReviews = state.userReviews.filter(
          (review) => review._id !== action.payload
        );
        
        // Remove from all reviews if exists
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
        
        state.loading = false;
        toast.success('Review deleted successfully!');
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearReviews, clearError } = reviewSlice.actions;

export default reviewSlice.reducer;
