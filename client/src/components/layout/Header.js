import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiMenu, FiUser, FiHeart, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { toggleSidebar, toggleSearchModal } from '../../redux/features/ui/uiSlice';
import { logout } from '../../redux/features/auth/authSlice';
import Button from '../common/Button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle user dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary-600">TravelEase</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/destinations" className="text-gray-700 hover:text-primary-600 font-medium">
            Destinations
          </Link>
          <Link to="/packages" className="text-gray-700 hover:text-primary-600 font-medium">
            Packages
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-primary-600 font-medium">
            Blog
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button
            onClick={() => dispatch(toggleSearchModal())}
            className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5" />
          </button>

          {/* User Actions */}
          {isAuthenticated ? (
            <div className="relative">
              {/* User Avatar/Button */}
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5" />
                )}
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Wishlist
                    {wishlistItems.length > 0 && (
                      <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Button to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button to="/register" variant="primary" size="sm">
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            aria-label="Menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
