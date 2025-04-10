import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

// Home page components
import Hero from '../components/home/Hero';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import FeaturedPackages from '../components/home/FeaturedPackages';
import Testimonials from '../components/home/Testimonials';
import WhyChooseUs from '../components/home/WhyChooseUs';

// Actions
import { getFeaturedDestinations } from '../redux/features/destinations/destinationSlice';
import { getFeaturedPackages } from '../redux/features/packages/packageSlice';
import { getFeaturedBlogs } from '../redux/features/blogs/blogSlice';

const HomePage = () => {
  const dispatch = useDispatch();

  // Fetch data on component mount
  useEffect(() => {
    // Load featured content
    dispatch(getFeaturedDestinations());
    dispatch(getFeaturedPackages());
    dispatch(getFeaturedBlogs(3)); // Limit to 3 featured blogs
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>TravelEase - Your Perfect Travel Companion</title>
        <meta 
          name="description" 
          content="Discover amazing destinations and book your dream vacation with TravelEase. We offer the best travel packages, tours, and experiences worldwide."
        />
      </Helmet>

      {/* Hero Section */}
      <Hero />

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* Featured Packages */}
      <FeaturedPackages />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-blue-100 mb-8">
              Stay updated with our latest travel deals, new destinations, and travel tips.
              Subscribe now and get exclusive offers directly to your inbox!
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
