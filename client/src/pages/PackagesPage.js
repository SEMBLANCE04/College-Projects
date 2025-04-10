import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getPackages } from '../redux/features/packages/packageSlice';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { FiFilter, FiX } from 'react-icons/fi';

const PackagesPage = () => {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  if (loading && packages.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title>Travel Packages | TravelEase</title>
        <meta 
          name="description" 
          content="Browse our selection of travel packages and tours. Find the perfect vacation package for your next adventure."
        />
      </Helmet>

      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">Travel Packages</h1>
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Discover our handpicked selection of premium travel experiences
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-700 font-medium"
              >
                {showFilters ? (
                  <>
                    <FiX className="mr-2" /> Hide Filters
                  </>
                ) : (
                  <>
                    <FiFilter className="mr-2" /> Show Filters
                  </>
                )}
              </button>
            </div>

            {/* Filters - Hidden on mobile unless toggled */}
            <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Filter Packages</h3>
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">Under $1,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">$1,000 - $2,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">$2,000 - $3,000</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">$3,000+</span>
                    </label>
                  </div>
                </div>
                
                {/* Duration Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Duration</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">1-3 Days</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">4-7 Days</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">8-14 Days</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                      <span className="ml-2 text-gray-700">15+ Days</span>
                    </label>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="md:w-3/4">
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                  {packages.map((pkg) => (
                    <Card
                      key={pkg._id}
                      id={pkg._id}
                      type="package"
                      image={pkg.imageCover || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b'}
                      title={pkg.name}
                      location={pkg.destination?.name || 'Exotic Location'}
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No packages found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PackagesPage;
