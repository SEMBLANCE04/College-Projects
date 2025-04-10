import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import { closeSidebar } from '../../redux/features/ui/uiSlice';
import { FiX, FiHome, FiMap, FiPackage, FiBookOpen, FiInfo, FiPhone, FiUser, FiHeart, FiShoppingBag, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeSidebar());
    navigate('/');
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    dispatch(closeSidebar());
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => dispatch(closeSidebar())}
      />

      {/* Sidebar */}
      <div className="relative w-64 max-w-xs w-full h-full bg-white shadow-xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="text-xl font-bold text-primary-600" onClick={() => dispatch(closeSidebar())}>
            TravelEase
          </Link>
          <button 
            onClick={() => dispatch(closeSidebar())}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Info (if authenticated) */}
        {isAuthenticated && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  {user?.name?.charAt(0).toUpperCase() || <FiUser />}
                </div>
              )}
              <div>
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
              >
                <FiHome className="w-5 h-5 mr-3 text-primary-600" />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/destinations')}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
              >
                <FiMap className="w-5 h-5 mr-3 text-primary-600" />
                <span>Destinations</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/packages')}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
              >
                <FiPackage className="w-5 h-5 mr-3 text-primary-600" />
                <span>Packages</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/blog')}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
              >
                <FiBookOpen className="w-5 h-5 mr-3 text-primary-600" />
                <span>Blog</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/about')}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
              >
                <FiInfo className="w-5 h-5 mr-3 text-primary-600" />
                <span>About</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/contact')}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
              >
                <FiPhone className="w-5 h-5 mr-3 text-primary-600" />
                <span>Contact</span>
              </button>
            </li>
          </ul>

          {/* User-specific links */}
          {isAuthenticated ? (
            <div className="mt-6 pt-6 border-t">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your Account
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <button 
                    onClick={() => handleNavigation('/profile')}
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                  >
                    <FiUser className="w-5 h-5 mr-3 text-primary-600" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/bookings')}
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                  >
                    <FiShoppingBag className="w-5 h-5 mr-3 text-primary-600" />
                    <span>My Bookings</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('/wishlist')}
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                  >
                    <FiHeart className="w-5 h-5 mr-3 text-primary-600" />
                    <span>Wishlist</span>
                  </button>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <button 
                      onClick={() => handleNavigation('/admin/dashboard')}
                      className="flex items-center w-full p-2 rounded-md hover:bg-gray-100"
                    >
                      <FiUser className="w-5 h-5 mr-3 text-primary-600" />
                      <span>Admin Dashboard</span>
                    </button>
                  </li>
                )}
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 text-red-600"
                  >
                    <FiLogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t space-y-2">
              <button 
                onClick={() => handleNavigation('/login')}
                className="flex items-center justify-center w-full p-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/register')}
                className="flex items-center justify-center w-full p-2 rounded-md border border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
