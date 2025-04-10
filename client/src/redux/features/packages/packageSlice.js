import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Get all packages
export const getPackages = createAsyncThunk(
  'packages/getPackages',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Convert query params to URL params
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await axios.get(`/api/packages${queryString}`);
      return res.data.data.packages;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch packages'
      );
    }
  }
);

// Get featured packages
export const getFeaturedPackages = createAsyncThunk(
  'packages/getFeaturedPackages',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/packages/featured?limit=${limit}`);
      return res.data.data.packages;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch featured packages'
      );
    }
  }
);

// Get top cheap packages
export const getTopCheapPackages = createAsyncThunk(
  'packages/getTopCheapPackages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/packages/top-cheap');
      return res.data.data.packages;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch top cheap packages'
      );
    }
  }
);

// Get package by ID
export const getPackage = createAsyncThunk(
  'packages/getPackage',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/packages/${id}`);
      return res.data.data.package;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch package'
      );
    }
  }
);

// Get packages by destination
export const getPackagesByDestination = createAsyncThunk(
  'packages/getPackagesByDestination',
  async (destinationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/packages/destination/${destinationId}`);
      return res.data.data.packages;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch packages by destination'
      );
    }
  }
);

// Create package (Admin only)
export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (packageData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/packages', packageData);
      return res.data.data.package;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create package'
      );
    }
  }
);

// Update package (Admin only)
export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, packageData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/packages/${id}`, packageData);
      return res.data.data.package;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update package'
      );
    }
  }
);

// Delete package (Admin only)
export const deletePackage = createAsyncThunk(
  'packages/deletePackage',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/packages/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete package'
      );
    }
  }
);

// Initial state
const initialState = {
  packages: [],
  featuredPackages: [],
  topCheapPackages: [],
  package: null,
  loading: false,
  error: null,
  filteredPackages: [],
  totalPages: 1,
  currentPage: 1,
};

// Packages slice
const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearPackage: (state) => {
      state.package = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    filterPackages: (state, action) => {
      const { filters } = action.payload;
      state.filteredPackages = state.packages.filter((pkg) => {
        // Filter by price range
        if (
          filters.priceRange &&
          (pkg.price < filters.priceRange[0] || pkg.price > filters.priceRange[1])
        ) {
          return false;
        }

        // Filter by duration
        if (
          filters.duration &&
          (pkg.duration < filters.duration[0] || pkg.duration > filters.duration[1])
        ) {
          return false;
        }

        // Filter by difficulty
        if (
          filters.difficulty &&
          filters.difficulty.length > 0 &&
          !filters.difficulty.includes(pkg.difficulty)
        ) {
          return false;
        }

        // Filter by destination
        if (filters.destination && pkg.destination._id !== filters.destination) {
          return false;
        }

        return true;
      });
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all packages
      .addCase(getPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackages.fulfilled, (state, action) => {
        state.packages = action.payload;
        state.filteredPackages = action.payload;
        state.loading = false;
      })
      .addCase(getPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get featured packages
      .addCase(getFeaturedPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedPackages.fulfilled, (state, action) => {
        state.featuredPackages = action.payload;
        state.loading = false;
      })
      .addCase(getFeaturedPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get top cheap packages
      .addCase(getTopCheapPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTopCheapPackages.fulfilled, (state, action) => {
        state.topCheapPackages = action.payload;
        state.loading = false;
      })
      .addCase(getTopCheapPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get package by ID
      .addCase(getPackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackage.fulfilled, (state, action) => {
        state.package = action.payload;
        state.loading = false;
      })
      .addCase(getPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get packages by destination
      .addCase(getPackagesByDestination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackagesByDestination.fulfilled, (state, action) => {
        state.packages = action.payload;
        state.filteredPackages = action.payload;
        state.loading = false;
      })
      .addCase(getPackagesByDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create package
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.packages.push(action.payload);
        state.loading = false;
        toast.success('Package created successfully!');
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Update package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.packages = state.packages.map((pkg) =>
          pkg._id === action.payload._id ? action.payload : pkg
        );
        state.package = action.payload;
        state.loading = false;
        toast.success('Package updated successfully!');
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Delete package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(
          (pkg) => pkg._id !== action.payload
        );
        state.loading = false;
        toast.success('Package deleted successfully!');
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearPackage, clearError, filterPackages, setCurrentPage } = packageSlice.actions;

export default packageSlice.reducer;
