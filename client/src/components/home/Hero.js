import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMap, FiCalendar, FiUsers } from 'react-icons/fi';
import Button from '../common/Button';

const Hero = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    date: '',
    travelers: 1,
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/packages?destination=${encodeURIComponent(searchParams.destination)}&date=${encodeURIComponent(searchParams.date)}&travelers=${searchParams.travelers}`);
  };

  return (
    <div className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Travel Destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 pt-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover the World's Most Amazing Places
          </h1>
          <p className="text-xl text-white mb-8">
            Find and book the perfect vacation package for your dream destination.
            Unforgettable experiences await you.
          </p>

          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Destination */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiMap className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="destination"
                    value={searchParams.destination}
                    onChange={handleInputChange}
                    placeholder="Where to?"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Date */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Travelers */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <select
                    name="travelers"
                    value={searchParams.travelers}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="mt-4"
              >
                Search Packages
              </Button>
            </form>
          </div>

          {/* Popular Destinations Quick Links */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-white">Popular:</span>
            {['Bali', 'Paris', 'Tokyo', 'New York', 'Maldives'].map((place) => (
              <button
                key={place}
                onClick={() => {
                  setSearchParams((prev) => ({ ...prev, destination: place }));
                  document.querySelector('form').dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true })
                  );
                }}
                className="text-white hover:text-blue-300 text-sm underline"
              >
                {place}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
