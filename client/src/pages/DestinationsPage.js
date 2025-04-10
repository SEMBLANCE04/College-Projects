import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getDestinations } from '../redux/features/destinations/destinationSlice';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';

const DestinationsPage = () => {
  const dispatch = useDispatch();
  const { destinations, loading } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);

  if (loading && destinations.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Explore Destinations | TravelEase</title>
        <meta 
          name="description" 
          content="Discover amazing destinations around the world. Find your perfect travel destination with TravelEase."
        />
      </Helmet>

      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">Explore Destinations</h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Discover amazing places around the world and find your next adventure
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
                <Link
                  key={destination._id}
                  to={`/destinations/${destination._id}`}
                  className="group block relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Destination Image */}
                  <div className="h-64 overflow-hidden">
                    <img
                      src={destination.imageUrl || 'https://images.unsplash.com/photo-1500835556837-99ac94a94552'}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-white text-sm mb-3">
                      <FiMapPin className="mr-1" />
                      <span>{destination.country}</span>
                    </div>
                    <p className="text-white text-sm line-clamp-2 mb-3">
                      {destination.description}
                    </p>
                    <div className="flex items-center text-white text-sm font-medium">
                      <span>Explore</span>
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No destinations found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DestinationsPage;
