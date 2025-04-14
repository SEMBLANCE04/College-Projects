import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlist/wishlistSlice';

const Card = ({
  id,
  type = 'package', // package, destination, blog
  image,
  title,
  subtitle,
  description,
  price,
  rating,
  location,
  duration,
  date,
  link,
  featured = false,
  className = '',
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  // Check if item is in wishlist
  const isInWishlist = wishlist.some(item => item._id === id);
  
  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}>
      {/* Card Image */}
      <div className="relative">
        <Link to={link}>
          <img 
            src={image && image.startsWith('http') ? image : 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b'} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        </Link>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        
        {/* Wishlist Button (only for packages) */}
        {type === 'package' && (
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-700'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <Link to={link} className="hover:text-blue-600">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{title}</h3>
          </Link>
          
          {rating && (
            <div className="flex items-center">
              <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
        
        {/* Subtitle or Location */}
        {(subtitle || location) && (
          <div className="flex items-center mb-2 text-gray-600">
            {type === 'package' || type === 'destination' ? (
              <>
                <span className="text-sm">{location}</span>
              </>
            ) : (
              <span className="text-sm">{subtitle}</span>
            )}
          </div>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        {/* Package Details */}
        {type === 'package' && (
          <>
            <div className="flex justify-between items-center mt-4">
              <div>
                {duration && <span className="text-sm text-gray-600">{duration}</span>}
              </div>
              <div>
                {price && (
                  <span className="text-lg font-bold text-blue-600">
                    ${typeof price === 'number' ? price.toLocaleString() : price}
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/packages/${id}`}
              className="block w-full mt-4 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Book Now
            </Link>

          </>
        )}
        
        {/* Blog Date */}
        {type === 'blog' && date && (
          <div className="mt-2 text-sm text-gray-500">{date}</div>
        )}
      </div>
    </div>
  );
};

export default Card;
