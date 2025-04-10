import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../common/Loader';

const AdminRoute = () => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but not admin, redirect to home
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If authenticated and admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
