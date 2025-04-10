import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFeaturedPackages } from '../../redux/features/packages/packageSlice';
import SectionTitle from '../common/SectionTitle';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Button from '../common/Button';
import { FiArrowRight } from 'react-icons/fi';

const FeaturedPackages = () => {
  const dispatch = useDispatch();
  const { featuredPackages, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    if (featuredPackages.length === 0) {
      dispatch(getFeaturedPackages());
    }
  }, [dispatch, featuredPackages.length]);

  if (loading && featuredPackages.length === 0) {
    return <Loader />;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Featured Tour Packages"
          subtitle="Discover our handpicked selection of premium travel experiences"
          center={true}
        />

        {featuredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
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
            <p className="text-gray-500">No featured packages found.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button to="/packages" variant="outline" className="inline-flex items-center">
            View All Packages
            <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
