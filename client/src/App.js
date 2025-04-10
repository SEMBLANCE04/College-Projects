import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import 'react-toastify/dist/ReactToastify.css';

// Redux
import { loadUser } from './redux/features/auth/authSlice';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Not Found Page
import NotFound from './pages/NotFound';

const App = () => {
  const dispatch = useDispatch();

  // Load user on app start if token exists
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <HelmetProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<div>Profile Page</div>} />
              <Route path="bookings" element={<div>My Bookings</div>} />
              <Route path="wishlist" element={<div>My Wishlist</div>} />
              <Route path="booking/:id" element={<div>Booking Details</div>} />
              <Route path="checkout/:packageId" element={<div>Checkout</div>} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<div>Admin Dashboard</div>} />
              <Route path="admin/users" element={<div>Manage Users</div>} />
              <Route path="admin/destinations" element={<div>Manage Destinations</div>} />
              <Route path="admin/packages" element={<div>Manage Packages</div>} />
              <Route path="admin/bookings" element={<div>Manage Bookings</div>} />
              <Route path="admin/reviews" element={<div>Manage Reviews</div>} />
              <Route path="admin/blogs" element={<div>Manage Blogs</div>} />
            </Route>
            
            {/* Public Content Routes */}
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="destinations/:id" element={<DestinationDetailPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="packages/:id" element={<PackageDetailPage />} />
            <Route path="blog" element={<div>Blog</div>} />
            <Route path="blog/:slug" element={<div>Blog Post</div>} />
            <Route path="about" element={<div>About Us</div>} />
            <Route path="contact" element={<div>Contact Us</div>} />
            <Route path="faq" element={<div>FAQ</div>} />
            <Route path="terms" element={<div>Terms & Conditions</div>} />
            <Route path="privacy" element={<div>Privacy Policy</div>} />
            <Route path="search" element={<div>Search Results</div>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
