import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import destinationReducer from './features/destinations/destinationSlice';
import packageReducer from './features/packages/packageSlice';
import bookingReducer from './features/bookings/bookingSlice';
import reviewReducer from './features/reviews/reviewSlice';
import blogReducer from './features/blogs/blogSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import uiReducer from './features/ui/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationReducer,
    packages: packageReducer,
    bookings: bookingReducer,
    reviews: reviewReducer,
    blogs: blogReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
