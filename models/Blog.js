const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const removeFile = promisify(fs.unlink);

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
      minlength: [5, 'Title must be at least 5 characters!'],
      required: [true, 'Title is required!'],
    },
    body: {
      type: String,
      trim: true,
      minlength: [20, 'Body must be at least 20 characters!'],
      required: [true, 'Body is required!'],
    },
    photo: {
      type: String,
      set(photo) {
        this._photo = this.photo; // store previous value -> to delete img when be updated
        return photo;
      },
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

blogSchema.pre('save', async function () {
  if (!this.isNew && this.isModified('photo'))
    await removeFile(path.join(__dirname, '../public', this._photo));
});

const autoPopulateAuthor = function () {
  this.populate('author');
};
blogSchema.pre('findOne', autoPopulateAuthor);
blogSchema.pre('find', autoPopulateAuthor);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
