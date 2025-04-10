import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiX, FiMapPin, FiPackage, FiBookOpen } from 'react-icons/fi';
import { closeSearchModal, setSearchQuery } from '../../redux/features/ui/uiSlice';

const SearchModal = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    destinations: [],
    packages: [],
    blogs: []
  });
  
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        dispatch(closeSearchModal());
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dispatch]);
  
  // Handle search input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  
  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      // In a real app, you would make API calls to search
      // For now, we'll simulate a search with setTimeout
      setTimeout(() => {
        // Simulated results
        setResults({
          destinations: [
            { id: 1, name: 'Paris, France', image: 'https://source.unsplash.com/random/300x200/?paris' },
            { id: 2, name: 'Bali, Indonesia', image: 'https://source.unsplash.com/random/300x200/?bali' },
          ],
          packages: [
            { id: 1, name: 'European Adventure', image: 'https://source.unsplash.com/random/300x200/?europe' },
            { id: 2, name: 'Asian Explorer', image: 'https://source.unsplash.com/random/300x200/?asia' },
          ],
          blogs: [
            { id: 1, title: 'Top 10 Places to Visit in 2023', image: 'https://source.unsplash.com/random/300x200/?travel' },
            { id: 2, title: 'Budget Travel Tips', image: 'https://source.unsplash.com/random/300x200/?budget' },
          ]
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
    }
  };
  
  // Handle result click
  const handleResultClick = (type, item) => {
    dispatch(closeSearchModal());
    dispatch(setSearchQuery(query));
    
    switch (type) {
      case 'destination':
        navigate(`/destinations/${item.id}`);
        break;
      case 'package':
        navigate(`/packages/${item.id}`);
        break;
      case 'blog':
        navigate(`/blog/${item.id}`);
        break;
      default:
        break;
    }
  };
  
  // Get filtered results based on active tab
  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return {
        destinations: results.destinations,
        packages: results.packages,
        blogs: results.blogs
      };
    }
    
    return {
      destinations: activeTab === 'destinations' ? results.destinations : [],
      packages: activeTab === 'packages' ? results.packages : [],
      blogs: activeTab === 'blogs' ? results.blogs : []
    };
  };
  
  const filteredResults = getFilteredResults();
  const hasResults = 
    filteredResults.destinations.length > 0 || 
    filteredResults.packages.length > 0 || 
    filteredResults.blogs.length > 0;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => dispatch(closeSearchModal())}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto mt-16 overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search destinations, packages, blogs..."
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => dispatch(closeSearchModal())}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            </form>
          </div>
          
          {/* Search Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'all' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setActiveTab('destinations')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'destinations' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Destinations
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'packages' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Packages
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex-1 py-3 px-4 text-sm font-medium ${
                activeTab === 'blogs' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Blogs
            </button>
          </div>
          
          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            ) : !query ? (
              <div className="p-8 text-center text-gray-500">
                <FiSearch className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">Type something to search</p>
              </div>
            ) : !hasResults ? (
              <div className="p-8 text-center text-gray-500">
                <p>No results found for "{query}"</p>
                <p className="mt-2 text-sm">Try different keywords or browse our categories</p>
              </div>
            ) : (
              <div className="p-4">
                {/* Destinations */}
                {filteredResults.destinations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <FiMapPin className="mr-2" />
                      Destinations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredResults.destinations.map(destination => (
                        <div
                          key={destination.id}
                          onClick={() => handleResultClick('destination', destination)}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <img 
                            src={destination.image} 
                            alt={destination.name} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="ml-4">
                            <h4 className="font-medium">{destination.name}</h4>
                            <p className="text-sm text-gray-500">Destination</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Packages */}
                {filteredResults.packages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <FiPackage className="mr-2" />
                      Tour Packages
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredResults.packages.map(pkg => (
                        <div
                          key={pkg.id}
                          onClick={() => handleResultClick('package', pkg)}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <img 
                            src={pkg.image} 
                            alt={pkg.name} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="ml-4">
                            <h4 className="font-medium">{pkg.name}</h4>
                            <p className="text-sm text-gray-500">Package</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Blogs */}
                {filteredResults.blogs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <FiBookOpen className="mr-2" />
                      Blog Posts
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredResults.blogs.map(blog => (
                        <div
                          key={blog.id}
                          onClick={() => handleResultClick('blog', blog)}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="ml-4">
                            <h4 className="font-medium">{blog.title}</h4>
                            <p className="text-sm text-gray-500">Blog Post</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-500 text-center">
              Press ESC to close or click outside
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
