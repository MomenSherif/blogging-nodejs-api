const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required!'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      min: [5, 'Title must be at least 5 characters!'],
      required: [true, 'Title is required!'],
    },
    body: {
      type: String,
      trim: true,
      min: [20, 'Body must be at least 20 characters!'],
      required: [true, 'Body is required!'],
    },
    photo: {
      type: String,
      required: [true, 'Photo is required!'],
    },
    tags: [String],
    slug: {
      type: String,
      slug: 'title',
      slug_padding_size: 3,
      unique: true,
    },
  },
  { timestamps: true }
);

blogSchema.plugin(slug);

blogSchema.index({ title: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
