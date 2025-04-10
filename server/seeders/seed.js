require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Blog = require('../models/Blog');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const destinations = [
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, known for its iconic Eiffel Tower, world-class museums, and romantic atmosphere.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre', 'Seine River Cruise'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000',
    rating: 4.8,
    location: {
      coordinates: [2.3522, 48.8566]
    },
    travelSeason: 'April to October',
    budget: 'High',
    isFeatured: true
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise known for its beautiful beaches, lush rice terraces, and spiritual temples.',
    highlights: ['Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Uluwatu Temple', 'Kuta Beach', 'Mount Batur'],
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000',
    rating: 4.7,
    location: {
      coordinates: [115.1889, -8.4095]
    },
    travelSeason: 'May to September',
    budget: 'Medium',
    isFeatured: true
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A vibrant metropolis that blends ultramodern and traditional, from neon-lit skyscrapers to historic temples.',
    highlights: ['Tokyo Skytree', 'Meiji Shrine', 'Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Fish Market'],
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000',
    rating: 4.9,
    location: {
      coordinates: [139.6503, 35.6762]
    },
    travelSeason: 'March to May and September to November',
    budget: 'High',
    isFeatured: true
  },
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Famous for its stunning white-washed buildings with blue domes, dramatic views, and spectacular sunsets.',
    highlights: ['Oia Village', 'Fira', 'Red Beach', 'Ancient Thera', 'Caldera Views'],
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000',
    rating: 4.8,
    location: {
      coordinates: [25.3961, 36.3932]
    },
    travelSeason: 'April to October',
    budget: 'High',
    isFeatured: true
  },
  {
    name: 'New York City',
    country: 'United States',
    description: 'The Big Apple offers world-famous attractions, diverse neighborhoods, and a vibrant cultural scene.',
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building', 'Brooklyn Bridge'],
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000',
    rating: 4.7,
    location: {
      coordinates: [-74.0060, 40.7128]
    },
    travelSeason: 'April to June and September to November',
    budget: 'High',
    isFeatured: false
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'An ancient Incan citadel set high in the Andes Mountains, offering breathtaking views and rich history.',
    highlights: ['Sun Gate', 'Huayna Picchu', 'Intihuatana Stone', 'Temple of the Sun', 'Inca Trail'],
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000',
    rating: 4.9,
    location: {
      coordinates: [-72.5450, -13.1631]
    },
    travelSeason: 'May to September',
    budget: 'Medium',
    isFeatured: true
  }
];

const packages = [
  {
    name: 'Romantic Paris Getaway',
    destination: null, // Will be set after destinations are created
    duration: 5,
    maxGroupSize: 12,
    difficulty: 'easy',
    summary: 'A romantic 5-day luxury package in the heart of Paris',
    description: 'Experience the romance of Paris with this 5-day luxury package. Includes Eiffel Tower visit, Seine River cruise, and fine dining experiences.',
    imageCover: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000', 
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1000', 
      'https://images.unsplash.com/photo-1520939817895-060bdaf4bc05?q=80&w=1000'
    ],
    itinerary: [
      { 
        day: 1, 
        title: 'Arrival & Welcome Dinner', 
        description: 'Arrive in Paris, check into your hotel, and enjoy a welcome dinner at a local restaurant.',
        activities: ['Hotel check-in', 'Welcome dinner'],
        accommodation: 'Hotel Paris Luxe',
        meals: {
          breakfast: false,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 2, 
        title: 'Eiffel Tower & Seine Cruise', 
        description: 'Visit the iconic Eiffel Tower and enjoy a romantic Seine River cruise.',
        activities: ['Eiffel Tower visit', 'Seine River cruise'],
        accommodation: 'Hotel Paris Luxe',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 3, 
        title: 'Louvre & Montmartre', 
        description: 'Explore the Louvre Museum and the artistic neighborhood of Montmartre.',
        activities: ['Louvre Museum tour', 'Montmartre walking tour'],
        accommodation: 'Hotel Paris Luxe',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 4, 
        title: 'Versailles Day Trip', 
        description: 'Take a day trip to the magnificent Palace of Versailles.',
        activities: ['Versailles guided tour', 'Gardens exploration'],
        accommodation: 'Hotel Paris Luxe',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      },
      { 
        day: 5, 
        title: 'Shopping & Departure', 
        description: 'Shop along the Champs-Élysées before your departure.',
        activities: ['Shopping at Champs-Élysées', 'Airport transfer'],
        accommodation: 'N/A',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: false
        }
      }
    ],
    price: 1499,
    priceDiscount: 1299,
    inclusions: ['4-night accommodation', 'Daily breakfast', 'Welcome dinner', 'Seine River cruise', 'Skip-the-line Eiffel Tower tickets', 'Versailles guided tour'],
    exclusions: ['Flights', 'Travel insurance', 'Personal expenses', 'Additional meals'],
    startDates: [
      new Date('2025-05-15'),
      new Date('2025-06-20'),
      new Date('2025-07-25')
    ],
    featured: true
  },
  {
    name: 'Bali Bliss Adventure',
    destination: null, // Will be set after destinations are created
    duration: 7,
    maxGroupSize: 10,
    difficulty: 'medium',
    summary: 'A 7-day adventure exploring the best of Bali',
    description: 'Discover the beauty of Bali with this 7-day adventure package. Explore temples, rice terraces, beaches, and immerse yourself in Balinese culture.',
    imageCover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1000', 
      'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1000', 
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000'
    ],
    itinerary: [
      { 
        day: 1, 
        title: 'Arrival & Spa Treatment', 
        description: 'Arrive in Bali, check into your hotel, and enjoy a welcome spa treatment.',
        activities: ['Hotel check-in', 'Welcome spa treatment'],
        accommodation: 'Ubud Jungle Resort',
        meals: {
          breakfast: false,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 2, 
        title: 'Ubud Exploration', 
        description: 'Visit the Ubud Monkey Forest, art markets, and the Royal Palace.',
        activities: ['Monkey Forest visit', 'Art market shopping', 'Royal Palace tour'],
        accommodation: 'Ubud Jungle Resort',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      },
      { 
        day: 3, 
        title: 'Rice Terraces & Coffee Plantation', 
        description: 'Explore the Tegallalang Rice Terraces and visit a local coffee plantation.',
        activities: ['Rice terrace hike', 'Coffee tasting'],
        accommodation: 'Ubud Jungle Resort',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: false
        }
      },
      { 
        day: 4, 
        title: 'Mount Batur Sunrise Trek', 
        description: 'Early morning trek to Mount Batur to witness a spectacular sunrise.',
        activities: ['Sunrise trek', 'Breakfast with a view', 'Hot springs visit'],
        accommodation: 'Kuta Beach Resort',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      },
      { 
        day: 5, 
        title: 'Beach Day', 
        description: 'Relax at Kuta Beach or try surfing lessons.',
        activities: ['Beach relaxation', 'Optional surfing lesson'],
        accommodation: 'Kuta Beach Resort',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 6, 
        title: 'Temple Tour', 
        description: 'Visit Tanah Lot and Uluwatu Temples with a traditional Kecak dance performance.',
        activities: ['Temple visits', 'Kecak dance show'],
        accommodation: 'Kuta Beach Resort',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      },
      { 
        day: 7, 
        title: 'Free Day & Departure', 
        description: 'Free time for shopping or relaxation before departure.',
        activities: ['Free time', 'Airport transfer'],
        accommodation: 'N/A',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: false
        }
      }
    ],
    price: 1199,
    priceDiscount: 999,
    inclusions: ['6-night accommodation', 'Daily breakfast', 'Welcome spa treatment', 'All transportation within Bali', 'Guided tours', 'Mount Batur trek'],
    exclusions: ['Flights', 'Travel insurance', 'Personal expenses', 'Additional meals'],
    startDates: [
      new Date('2025-06-10'),
      new Date('2025-07-15'),
      new Date('2025-08-20')
    ],
    featured: true
  },
  {
    name: 'Tokyo Explorer',
    destination: null, // Will be set after destinations are created
    duration: 6,
    maxGroupSize: 8,
    difficulty: 'medium',
    summary: 'A 6-day journey through traditional and modern Tokyo',
    description: 'Immerse yourself in Japanese culture and modern technology with this 6-day Tokyo package. Explore ancient temples, futuristic districts, and culinary delights.',
    imageCover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000', 
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1000', 
      'https://images.unsplash.com/photo-1548083397-9e5d6700c495?q=80&w=1000'
    ],
    itinerary: [
      { 
        day: 1, 
        title: 'Arrival & Tokyo Tower', 
        description: 'Arrive in Tokyo, check into your hotel, and visit Tokyo Tower for night views.',
        activities: ['Hotel check-in', 'Tokyo Tower visit'],
        accommodation: 'Shinjuku Modern Hotel',
        meals: {
          breakfast: false,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 2, 
        title: 'Traditional Tokyo', 
        description: 'Visit Meiji Shrine, Senso-ji Temple, and the Imperial Palace Gardens.',
        activities: ['Meiji Shrine visit', 'Senso-ji Temple tour', 'Imperial Palace Gardens'],
        accommodation: 'Shinjuku Modern Hotel',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: false
        }
      },
      { 
        day: 3, 
        title: 'Modern Tokyo', 
        description: 'Explore Shibuya, Harajuku, and Shinjuku districts.',
        activities: ['Shibuya Crossing', 'Harajuku shopping', 'Shinjuku nightlife'],
        accommodation: 'Shinjuku Modern Hotel',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: true
        }
      },
      { 
        day: 4, 
        title: 'Mt. Fuji Day Trip', 
        description: 'Take a day trip to Mt. Fuji and Hakone.',
        activities: ['Mt. Fuji viewing', 'Lake Ashi cruise', 'Hakone ropeway'],
        accommodation: 'Shinjuku Modern Hotel',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: false
        }
      },
      { 
        day: 5, 
        title: 'Culinary Experience', 
        description: 'Enjoy a sushi-making class and visit Tsukiji Outer Market.',
        activities: ['Sushi-making class', 'Market tour', 'Food tasting'],
        accommodation: 'Shinjuku Modern Hotel',
        meals: {
          breakfast: true,
          lunch: true,
          dinner: true
        }
      },
      { 
        day: 6, 
        title: 'Shopping & Departure', 
        description: 'Shop in Ginza or Akihabara before your departure.',
        activities: ['Shopping', 'Airport transfer'],
        accommodation: 'N/A',
        meals: {
          breakfast: true,
          lunch: false,
          dinner: false
        }
      }
    ],
    price: 1699,
    priceDiscount: 1499,
    inclusions: ['5-night accommodation', 'Daily breakfast', 'Tokyo subway pass', 'Mt. Fuji day trip', 'Sushi-making class', 'Airport transfers'],
    exclusions: ['Flights', 'Travel insurance', 'Personal expenses', 'Additional meals'],
    startDates: [
      new Date('2025-04-05'),
      new Date('2025-05-10'),
      new Date('2025-09-15')
    ],
    featured: true
  }
];

const blogs = [
  {
    title: '10 Must-Visit Destinations for 2025',
    content: `
      # 10 Must-Visit Destinations for 2025
      
      As travel continues to evolve, new destinations emerge while classics reinvent themselves. Here are our top picks for 2025:
      
      ## 1. Kyoto, Japan
      Beyond Tokyo's neon lights, Kyoto offers a glimpse into traditional Japan with its temples, tea houses, and cherry blossoms.
      
      ## 2. Lisbon, Portugal
      Europe's sunniest capital is gaining popularity for its beautiful architecture, delicious food, and affordable prices.
      
      ## 3. Mexico City, Mexico
      A cultural powerhouse with world-class museums, incredible food, and vibrant neighborhoods.
      
      ## 4. Cape Town, South Africa
      Where mountains meet the ocean, offering stunning landscapes, wildlife, and wine regions.
      
      ## 5. Tbilisi, Georgia
      The Caucasus gem is emerging as a hotspot for food, wine, and unique architecture.
      
      ## 6. Queenstown, New Zealand
      Adventure capital of the world, surrounded by breathtaking mountains and lakes.
      
      ## 7. Marrakech, Morocco
      A sensory overload of colors, scents, and sounds in its historic medina and souks.
      
      ## 8. Helsinki, Finland
      Leading the way in sustainable tourism and design innovation.
      
      ## 9. Cartagena, Colombia
      Colonial charm meets Caribbean vibes in this colorful walled city.
      
      ## 10. Ljubljana, Slovenia
      Europe's greenest capital is a perfect base to explore the country's diverse landscapes.
      
      Which destination is on your 2025 travel list?
    `,
    summary: 'Discover the top travel destinations to visit in 2025, from traditional Kyoto to vibrant Mexico City and beyond.',
    author: null, // Will be set after users are created
    coverImage: 'destinations-cover.jpg',
    images: ['destination-1.jpg', 'destination-2.jpg', 'destination-3.jpg'],
    category: 'destinations',
    tags: ['travel tips', 'destinations', '2025', 'travel planning'],
    isFeatured: true
  },
  {
    title: 'How to Travel on a Budget: Tips and Tricks',
    content: `
      # How to Travel on a Budget: Tips and Tricks
      
      Traveling doesn't have to break the bank. With careful planning and smart choices, you can see the world without emptying your wallet. Here are our top budget travel tips:
      
      ## Plan Ahead, But Stay Flexible
      Booking flights and accommodation in advance usually means better prices, but keep some flexibility in your itinerary to take advantage of unexpected deals or opportunities.
      
      ## Travel During Shoulder Season
      Visit popular destinations just before or after peak season. You'll enjoy fewer crowds, lower prices, and often better weather.
      
      ## Use Flight Deal Alerts
      Sign up for services like Scott's Cheap Flights, Skyscanner alerts, or follow flight deal accounts on social media.
      
      ## Consider Alternative Accommodations
      Look beyond hotels to hostels, guesthouses, vacation rentals, or even house-sitting opportunities.
      
      ## Eat Like a Local
      Skip tourist restaurants and eat where locals eat. Visit markets, street food stalls, and small family-run establishments.
      
      ## Use Public Transportation
      Buses, trains, and metros are not only cheaper than taxis but also offer a more authentic local experience.
      
      ## Take Free Walking Tours
      Many cities offer free walking tours (tip-based) that provide excellent introductions to major sights and local history.
      
      ## Travel Slow
      Spending more time in fewer places reduces transportation costs and allows for deeper experiences.
      
      ## Use Travel Rewards and Points
      Maximize credit card points, airline miles, and hotel loyalty programs to earn free or discounted travel.
      
      ## Pack Light
      Avoid checked baggage fees and the hassle of lugging heavy suitcases by packing only what you truly need.
      
      What are your favorite budget travel tips?
    `,
    summary: 'Learn how to explore the world without breaking the bank with these practical budget travel tips and strategies.',
    author: null, // Will be set after users are created
    coverImage: 'budget-travel-cover.jpg',
    images: ['budget-1.jpg', 'budget-2.jpg'],
    category: 'budget',
    tags: ['budget travel', 'travel tips', 'saving money', 'backpacking'],
    isFeatured: true
  }
];

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@travelease.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      return adminExists;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@travelease.com',
      password: 'admin123',
      passwordConfirm: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created');
    return admin;
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await Destination.deleteMany({});
    await Package.deleteMany({});
    await Blog.deleteMany({});
    
    console.log('Previous data cleared');

    // Create admin user
    const admin = await createAdminUser();

    // Insert destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log(`${createdDestinations.length} destinations created`);

    // Update packages with destination IDs
    packages[0].destination = createdDestinations.find(d => d.name === 'Paris')._id;
    packages[1].destination = createdDestinations.find(d => d.name === 'Bali')._id;
    packages[2].destination = createdDestinations.find(d => d.name === 'Tokyo')._id;

    // Insert packages
    const createdPackages = await Package.insertMany(packages);
    console.log(`${createdPackages.length} packages created`);

    // Update blogs with author ID
    blogs.forEach(blog => {
      blog.author = admin._id;
    });

    // Insert blogs
    const createdBlogs = await Blog.insertMany(blogs);
    console.log(`${createdBlogs.length} blogs created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
