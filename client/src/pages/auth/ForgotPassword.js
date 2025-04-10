import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError } from '../../redux/features/auth/authSlice';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Set email sent status when message is received
  useEffect(() => {
    if (message && message.includes('reset')) {
      setEmailSent(true);
    }
  }, [message]);

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setFormError('');
  };

  // Validate form
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setFormError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(forgotPassword({ email }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {emailSent 
              ? 'Check your email for a reset link' 
              : 'Enter your email address and we\'ll send you a link to reset your password'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {emailSent && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">
              We've sent a password reset link to your email. Please check your inbox and follow the instructions.
            </span>
          </div>
        )}

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border ${
                    formError ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                />
              </div>
              {formError && (
                <p className="mt-1 text-sm text-red-600">{formError}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? <Loader /> : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setEmailSent(false)}
              className="group relative flex justify-center py-2 px-4 border border-blue-600 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Again
            </Button>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center">
            <FiArrowLeft className="mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
