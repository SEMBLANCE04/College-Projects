import React from 'react';
import { FiShield, FiDollarSign, FiHeadphones, FiThumbsUp, FiMap, FiCalendar } from 'react-icons/fi';
import SectionTitle from '../common/SectionTitle';

const features = [
  {
    id: 1,
    icon: <FiShield className="w-10 h-10 text-blue-600" />,
    title: 'Secure Booking',
    description: 'Your payments and personal information are always protected with our secure booking system.',
  },
  {
    id: 2,
    icon: <FiDollarSign className="w-10 h-10 text-blue-600" />,
    title: 'Best Price Guarantee',
    description: 'We promise the best rates and will match any lower price you find elsewhere.',
  },
  {
    id: 3,
    icon: <FiHeadphones className="w-10 h-10 text-blue-600" />,
    title: '24/7 Customer Support',
    description: 'Our dedicated support team is available around the clock to assist with any questions or concerns.',
  },
  {
    id: 4,
    icon: <FiThumbsUp className="w-10 h-10 text-blue-600" />,
    title: 'Verified Reviews',
    description: 'All our reviews come from real travelers who have experienced our services firsthand.',
  },
  {
    id: 5,
    icon: <FiMap className="w-10 h-10 text-blue-600" />,
    title: 'Handpicked Destinations',
    description: 'We carefully select each destination to ensure quality, safety, and unforgettable experiences.',
  },
  {
    id: 6,
    icon: <FiCalendar className="w-10 h-10 text-blue-600" />,
    title: 'Flexible Booking',
    description: 'Plans change, and we understand. Enjoy free cancellation options on most bookings.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Why Choose TravelEase"
          subtitle="Discover the advantages of booking your dream vacation with us"
          center={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-blue-600 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="p-8 text-center border-r border-b md:border-b-0 border-blue-500">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="p-8 text-center border-b md:border-r md:border-b-0 border-blue-500">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Destinations</div>
            </div>
            <div className="p-8 text-center border-r border-blue-500">
              <div className="text-4xl font-bold text-white mb-2">800+</div>
              <div className="text-blue-100">Tour Packages</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
