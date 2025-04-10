import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import SectionTitle from '../common/SectionTitle';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    text: 'Our trip to Bali was absolutely magical! TravelEase handled everything perfectly from accommodation to tours. The local guides were knowledgeable and friendly. Will definitely book with them again!',
    destination: 'Bali, Indonesia',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Toronto, Canada',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
    text: 'The European tour package exceeded all our expectations. Every detail was taken care of, and the itinerary was perfectly balanced between guided tours and free time to explore on our own.',
    destination: 'Europe Tour',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    location: 'London, UK',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    rating: 4,
    text: 'Our family vacation to Costa Rica was incredible! The kids loved the adventure activities, and we appreciated how smoothly everything went. The accommodations were excellent and exactly as described.',
    destination: 'Costa Rica',
  },
  {
    id: 4,
    name: 'David Wilson',
    location: 'Sydney, Australia',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    text: 'The Japan cultural tour was a once-in-a-lifetime experience. Our guide was exceptional and provided insights we would never have discovered on our own. The traditional ryokan stays were authentic and comfortable.',
    destination: 'Japan',
  },
  {
    id: 5,
    name: 'Priya Patel',
    location: 'Mumbai, India',
    avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
    rating: 5,
    text: 'Our honeymoon in the Maldives was absolute perfection! TravelEase arranged everything from the overwater bungalow to the private dining experiences. It was truly the romantic getaway we dreamed of.',
    destination: 'Maldives',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Render stars based on rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="What Our Travelers Say"
          subtitle="Read testimonials from our satisfied customers around the world"
          center={true}
        />

        <div 
          className="max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Testimonial Slider */}
          <div className="relative bg-white rounded-lg shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row">
              {/* Avatar and Info */}
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h4 className="text-lg font-bold text-center">{testimonials[activeIndex].name}</h4>
                <p className="text-sm text-gray-600 text-center">{testimonials[activeIndex].location}</p>
                <div className="flex mt-2">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
                <p className="text-sm text-blue-600 font-medium mt-2">
                  {testimonials[activeIndex].destination}
                </p>
              </div>

              {/* Testimonial Text */}
              <div className="md:w-2/3 md:pl-8">
                <div className="relative">
                  <svg
                    className="absolute top-0 left-0 transform -translate-x-6 -translate-y-6 h-16 w-16 text-blue-100"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative text-lg md:text-xl text-gray-800 italic">
                    "{testimonials[activeIndex].text}"
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
