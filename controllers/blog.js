const Blog = require('../models/Blog');

const CustomError = require('../helper/CustomError');

const createBlog = async (req, res) => {
  req.body.photo = `/uploads/${req.file.filename}`;
  req.body.author = req.user._id;
  const blog = new Blog(req.body);
  await blog.save();
  res.status(201).json(blog);
};

const updateBlog = async (req, res) => {
  // To trigger  pre save hook for [slug]
  if (req.file) req.body.photo = `/uploads/${req.file.filename}`;
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

const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw new CustomError(404, 'Blog Not Found!');
  res.json(blog);
};

const getBlogs = async (req, res) => {
  const { page = 1, pagesize = 5 } = req.query;
  const blogsPromise = Blog.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * pagesize)
    .limit(pagesize);
  const countPromise = Blog.count();
  const [count, blogs] = await Promise.all([countPromise, blogsPromise]);
  const pages = Math.ceil(count / pagesize);

  res.json({ pages, test: blogs.length, blogs });
};

module.exports = {
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogBySlug,
  getBlogs,
};
