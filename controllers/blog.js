const Blog = require('../models/Blog');

const createBlog = async (req, res) => {
  req.body.author = req.user._id;
  const blog = new Blog(req.body);
  await blog.save();
  res.status(201).json(blog);
};

const updateBlog = async (req, res) => {
  // To trigger  pre save hook for [slug]
  const updates = Object.keys(req.body);
  updates.forEach((update) => {
    req.blog[update] = req.body[update];
  });
  await req.blog.save();
  res.json(req.blog);
};

const deleteBlog = async (req, res) => {
  await req.blog.remove();
  res.json({ message: 'Deleted Successfully!' });
};

module.exports = {
  createBlog,
  deleteBlog,
  updateBlog,
};
