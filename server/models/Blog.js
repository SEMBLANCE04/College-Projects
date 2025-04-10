const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
      unique: true,
      trim: true,
      maxlength: [100, 'A blog title must have less or equal than 100 characters']
    },
    slug: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A blog must have an author']
    },
    content: {
      type: String,
      required: [true, 'A blog must have content']
    },
    summary: {
      type: String,
      required: [true, 'A blog must have a summary'],
      trim: true,
      maxlength: [200, 'A blog summary must have less or equal than 200 characters']
    },
    coverImage: {
      type: String,
      required: [true, 'A blog must have a cover image']
    },
    images: [String],
    category: {
      type: String,
      required: [true, 'A blog must have a category'],
      enum: {
        values: [
          'travel-tips',
          'destinations',
          'adventures',
          'food',
          'culture',
          'budget',
          'luxury',
          'family',
          'solo'
        ],
        message: 'Category is not valid'
      }
    },
    tags: [String],
    readTime: {
      type: Number,
      default: 5 // in minutes
    },
    featured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Middleware to populate author on find
blogSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name photo'
  });
  
  this.find({ active: { $ne: false } });
  next();
});

// Virtual field for comments
blogSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'blog',
  localField: '_id'
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
