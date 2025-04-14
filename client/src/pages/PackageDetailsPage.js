import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import { getPackageById } from '../redux/features/packages/packageSlice';
import Modal from '../components/common/Modal';
import axios from 'axios';

const PackageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentPackage, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(getPackageById(id));
  }, [dispatch, id]);

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = currentPackage?.price || 0;
    return basePrice * travelers;
  };

  // Handle booking
  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      setModalType('error');
      setModalMessage('Please select a travel date');
      setIsModalOpen(true);
      return;
    }

    try {
      setModalType('loading');
      setModalMessage('Processing your booking...');
      setIsModalOpen(true);

      // Create checkout session
      const response = await axios.post(`/api/bookings/checkout-session/${id}`, {
        travelDate: selectedDate,
        numberOfTravelers: travelers
      });

      // Redirect to Stripe checkout
      if (response.data && response.data.session && response.data.session.url) {
        window.location.href = response.data.session.url;
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Booking error:', error);
      setModalType('error');
      setModalMessage(error.response?.data?.message || 'Failed to process booking. Please try again.');
      setIsModalOpen(true);
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!currentPackage) {
    return <div className="container mx-auto px-4 py-8">Package not found</div>;
  }

  // Get available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <>
      <Helmet>
        <title>{currentPackage.title} | TravelEase</title>
        <meta name="description" content={currentPackage.description} />
      </Helmet>

      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">{currentPackage.title}</h1>
          <p className="text-xl text-blue-100">{currentPackage.location}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Package Details */}
          <div className="md:col-span-2">
            <img 
              src={currentPackage.image} 
              alt={currentPackage.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">About this package</h2>
              <p>{currentPackage.description}</p>
              
              <h3 className="text-xl font-bold mt-8 mb-4">What's included</h3>
              <ul className="list-disc pl-5">
                <li>Professional guide</li>
                <li>Transportation</li>
                <li>Accommodation</li>
                <li>Meals as per itinerary</li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Book This Package</h3>
              
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Select Date</label>
                <div className="relative">
                  <FiCalendar className="absolute top-3 left-3 text-gray-400" />
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a date</option>
                    {getAvailableDates().map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Number of Travelers</label>
                <div className="relative">
                  <FiUsers className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={travelers}
                    onChange={(e) => setTravelers(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>Duration: {currentPackage.duration}</span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Price per person</span>
                  <span>${currentPackage.price}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Book Now
              </button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                No payment required now. We'll contact you to confirm availability.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        message={modalMessage}
      />
    </>
  );
};

export default PackageDetailsPage;
