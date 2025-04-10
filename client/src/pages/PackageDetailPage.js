import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getPackage } from '../redux/features/packages/packageSlice';
import Loader from '../components/common/Loader';
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiCheck, FiX, FiStar } from 'react-icons/fi';

const PackageDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { package: tourPackage, loading } = useSelector((state) => state.packages);
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(getPackage(id));
    }
  }, [dispatch, id]);

  if (loading && !tourPackage) {
    return <Loader />;
  }

  if (!tourPackage) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Package not found</h2>
        <p className="mt-4 text-gray-600">The package you're looking for doesn't exist or has been removed.</p>
        <Link to="/packages" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
          Browse all packages
        </Link>
      </div>
    );
  }

  const handleBookNow = () => {
    // Implement booking logic
    console.log('Booking package with ID:', id);
    console.log('Selected date:', selectedDate);
    console.log('Number of travelers:', travelers);
  };

  return (
    <>
      <Helmet>
        <title>{tourPackage.name} | TravelEase</title>
        <meta name="description" content={tourPackage.summary?.substring(0, 160)} />
      </Helmet>

      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center" 
        style={{ backgroundImage: `url(${tourPackage.imageCover && tourPackage.imageCover.startsWith('http') ? tourPackage.imageCover : 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{tourPackage.name}</h1>
            <div className="flex items-center mb-4">
              <FiMapPin className="mr-2" />
              <span>{tourPackage.destination?.name || 'Exotic Location'}</span>
            </div>
            <div className="flex items-center space-x-4">
              {tourPackage.rating && (
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>{tourPackage.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{tourPackage.duration} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <div className="bg-blue-50 p-4 rounded-lg mb-8 flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-blue-600">${tourPackage.price}</span>
                <span className="text-gray-600 ml-1">per person</span>
              </div>
              {tourPackage.priceDiscount > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Save ${tourPackage.priceDiscount}
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">{tourPackage.description || tourPackage.summary}</p>
            </div>

            {/* Itinerary */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Itinerary</h3>
              <div className="space-y-6">
                {tourPackage.itinerary && tourPackage.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-lg">Day {index + 1}</h4>
                    {typeof day === 'string' ? (
                      <p className="text-gray-700">{day}</p>
                    ) : (
                      <div>
                        {day.title && <h5 className="font-medium">{day.title}</h5>}
                        {day.description && <p className="text-gray-700 mt-1">{day.description}</p>}
                        {day.activities && (
                          <div className="mt-2">
                            <span className="font-medium">Activities: </span>
                            {typeof day.activities === 'string' ? (
                              <span className="text-gray-700">{day.activities}</span>
                            ) : Array.isArray(day.activities) ? (
                              <span className="text-gray-700">{day.activities.join(', ')}</span>
                            ) : (
                              <span className="text-gray-700">Activities information available</span>
                            )}
                          </div>
                        )}
                        {day.accommodation && (
                          <div className="mt-1">
                            <span className="font-medium">Accommodation: </span>
                            <span className="text-gray-700">{day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div className="mt-1">
                            <span className="font-medium">Meals: </span>
                            {typeof day.meals === 'string' ? (
                              <span className="text-gray-700">{day.meals}</span>
                            ) : (
                              <span className="text-gray-700">
                                {day.meals.breakfast && 'Breakfast '}
                                {day.meals.lunch && 'Lunch '}
                                {day.meals.dinner && 'Dinner'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {(!tourPackage.itinerary || tourPackage.itinerary.length === 0) && (
                  <p className="text-gray-500 italic">Detailed itinerary not available</p>
                )}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {tourPackage.inclusions && tourPackage.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                  {(!tourPackage.inclusions || tourPackage.inclusions.length === 0) && (
                    <li className="text-gray-500 italic">Inclusions not specified</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">What's Not Included</h3>
                <ul className="space-y-2">
                  {tourPackage.exclusions && tourPackage.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                  {(!tourPackage.exclusions || tourPackage.exclusions.length === 0) && (
                    <li className="text-gray-500 italic">Exclusions not specified</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Book This Package</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="date">
                    Select Date
                  </label>
                  <select
                    id="date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  >
                    <option value="">Select a date</option>
                    {tourPackage.startDates && tourPackage.startDates.map((date, index) => (
                      <option key={index} value={new Date(date).toISOString()}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </option>
                    ))}
                    {(!tourPackage.startDates || tourPackage.startDates.length === 0) && (
                      <option value="custom">Contact for available dates</option>
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="travelers">
                    Number of Travelers
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </button>
                    <input
                      id="travelers"
                      type="number"
                      min="1"
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 p-2 text-center border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span>Price per person</span>
                    <span>${tourPackage.price}</span>
                  </div>
                  {tourPackage.priceDiscount > 0 && (
                    <div className="flex justify-between mb-2 text-red-500">
                      <span>Discount</span>
                      <span>-${tourPackage.priceDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(tourPackage.price - (tourPackage.priceDiscount || 0)) * travelers}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBookNow}
                className="mt-6 block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition duration-300"
                disabled={!selectedDate}
              >
                Book Now
              </button>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                No payment required now. We'll contact you to confirm availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageDetailPage;
