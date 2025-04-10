import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFeaturedDestinations } from '../../redux/features/destinations/destinationSlice';
import SectionTitle from '../common/SectionTitle';
import Loader from '../common/Loader';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';

const FeaturedDestinations = () => {
  const dispatch = useDispatch();
  const { featuredDestinations, loading } = useSelector((state) => state.destinations);

  useEffect(() => {
    if (featuredDestinations.length === 0) {
      dispatch(getFeaturedDestinations());
    }
  }, [dispatch, featuredDestinations.length]);

  if (loading && featuredDestinations.length === 0) {
    return <Loader />;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Popular Destinations"
          subtitle="Explore our most popular travel destinations around the world"
          center={true}
        />

        {featuredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
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
            <p className="text-gray-500">No featured destinations found.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/destinations"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Destinations
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
