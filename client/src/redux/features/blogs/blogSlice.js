import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Get all blogs
export const getBlogs = createAsyncThunk(
  'blogs/getBlogs',
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
      const res = await axios.get(`/api/blogs${queryString}`);
      return res.data.data.blogs;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch blogs'
      );
    }
  }
);

// Get featured blogs
export const getFeaturedBlogs = createAsyncThunk(
  'blogs/getFeaturedBlogs',
  async (limit = 3, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/blogs/featured?limit=${limit}`);
      return res.data.data.blogs;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch featured blogs'
      );
    }
  }
);

// Get blog by ID or slug
export const getBlog = createAsyncThunk(
  'blogs/getBlog',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/blogs/${idOrSlug}`);
      return res.data.data.blog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch blog'
      );
    }
  }
);

// Get blogs by category
export const getBlogsByCategory = createAsyncThunk(
  'blogs/getBlogsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/blogs/category/${category}`);
      return res.data.data.blogs;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch blogs by category'
      );
    }
  }
);

// Search blogs
export const searchBlogs = createAsyncThunk(
  'blogs/searchBlogs',
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/blogs/search?query=${query}`);
      return res.data.data.blogs;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to search blogs'
      );
    }
  }
);

// Create blog (Admin only)
export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/blogs', blogData);
      return res.data.data.blog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create blog'
      );
    }
  }
);

// Update blog (Admin only)
export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/blogs/${id}`, blogData);
      return res.data.data.blog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update blog'
      );
    }
  }
);

// Delete blog (Admin only)
export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete blog'
      );
    }
  }
);

// Initial state
const initialState = {
  blogs: [],
  featuredBlogs: [],
  blog: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

// Blogs slice
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearBlog: (state) => {
      state.blog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all blogs
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get featured blogs
      .addCase(getFeaturedBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedBlogs.fulfilled, (state, action) => {
        state.featuredBlogs = action.payload;
        state.loading = false;
      })
      .addCase(getFeaturedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get blog by ID or slug
      .addCase(getBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.blog = action.payload;
        state.loading = false;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Get blogs by category
      .addCase(getBlogsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBlogsByCategory.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(getBlogsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search blogs
      .addCase(searchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
        state.loading = false;
        toast.success('Blog created successfully!');
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        );
        state.blog = action.payload;
        state.loading = false;
        toast.success('Blog updated successfully!');
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.payload
        );
        state.loading = false;
        toast.success('Blog deleted successfully!');
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearBlog, clearError, setCurrentPage } = blogSlice.actions;

export default blogSlice.reducer;
