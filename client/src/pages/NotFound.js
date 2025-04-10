import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiSearch, FiPhoneCall } from 'react-icons/fi';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - TravelEase</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="text-gray-600 mt-4">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button to="/" variant="primary" className="flex items-center justify-center">
              <FiHome className="mr-2" />
              Back to Home
            </Button>
            <Button to="/destinations" variant="outline" className="flex items-center justify-center">
              <FiSearch className="mr-2" />
              Explore Destinations
            </Button>
            <Button to="/contact" variant="secondary" className="flex items-center justify-center">
              <FiPhoneCall className="mr-2" />
              Contact Us
            </Button>
          </div>

          <div className="mt-12">
            <p className="text-gray-500">
              Need help? <Link to="/contact" className="text-blue-600 hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
