import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getDestination } from '../redux/features/destinations/destinationSlice';
import { getPackagesByDestination } from '../redux/features/packages/packageSlice';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import { FiMapPin, FiCalendar, FiStar, FiArrowRight } from 'react-icons/fi';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { destination, loading: destinationLoading } = useSelector((state) => state.destinations);
  const { destinationPackages, loading: packagesLoading } = useSelector((state) => state.packages);

  useEffect(() => {
    if (id) {
      dispatch(getDestination(id));
      dispatch(getPackagesByDestination(id));
    }
  }, [dispatch, id]);

  if (destinationLoading && !destination) {
    return <Loader />;
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Destination not found</h2>
        <p className="mt-4 text-gray-600">The destination you're looking for doesn't exist or has been removed.</p>
        <Link to="/destinations" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
          Browse all destinations
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{destination.name} | TravelEase</title>
        <meta name="description" content={destination.description?.substring(0, 160)} />
      </Helmet>

      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center" 
        style={{ backgroundImage: `url(${destination.imageUrl && destination.imageUrl.startsWith('http') ? destination.imageUrl : 'https://images.unsplash.com/photo-1500835556837-99ac94a94552'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center mb-4">
              <FiMapPin className="mr-2" />
              <span>{destination.country}</span>
            </div>
            <div className="flex items-center space-x-4">
              {destination.rating && (
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>{destination.rating.toFixed(1)}</span>
                </div>
              )}
              {destination.travelSeason && (
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  <span>Best time: {destination.travelSeason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">{destination.description}</p>
            </div>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Places to Visit */}
            {destination.placesToVisit && destination.placesToVisit.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Places to Visit</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.placesToVisit.map((place, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">{place}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Info Card */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Travel Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Best Time to Visit</h4>
                  <p className="text-gray-700">{destination.travelSeason || 'All year round'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Local Currency</h4>
                  <p className="text-gray-700">{destination.currency || 'Information not available'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Language</h4>
                  <p className="text-gray-700">{destination.language || 'Information not available'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Visa Requirements</h4>
                  <p className="text-gray-700">{destination.visaRequirements || 'Information not available'}</p>
                </div>
              </div>
              
              <Link
                to="/contact"
                className="mt-6 block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition duration-300"
              >
                Inquire About This Destination
              </Link>
            </div>
          </div>
        </div>

        {/* Packages for this Destination */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Travel Packages to {destination.name}</h2>
          
          {packagesLoading ? (
            <Loader />
          ) : destinationPackages && destinationPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinationPackages.map((pkg) => (
                <Card
                  key={pkg._id}
                  id={pkg._id}
                  type="package"
                  image={pkg.imageCover || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b'}
                  title={pkg.name}
                  location={destination.name}
                  description={pkg.summary}
                  price={pkg.price}
                  rating={pkg.rating || 4.5}
                  duration={`${pkg.duration} days`}
                  featured={pkg.featured}
                  link={`/packages/${pkg._id}`}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-700 mb-4">No packages available for this destination yet.</p>
              <Link to="/packages" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                Browse all packages <FiArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DestinationDetailPage;
