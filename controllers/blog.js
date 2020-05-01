const Blog = require('../models/Blog');
const User = require('../models/User');

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
  const blog = await Blog.findOne({ slug: req.params.slug }).populate({
    path: 'author',
    select: 'firstName lastName email slug',
  });
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

  res.json({ pages, blogs });
};

// ? Crazy query need to be modified LATER [Tried to support multiple search at one time]
/**
 * Search?  // first 5 results -> will support pagination later
 *        title= any keyword
 *       &author= any name, not needed to be full name
 *       &tag= ex: frontend
 */
const searchForBlog = async (req, res) => {
  const { author, title, tag } = req.query;
  const match = {
    tags: tag || { $exists: true },
  };
  // support text index search for title
  if (title)
    match['$text'] = {
      $search: title,
    };

  const blogs = await Blog.aggregate([
    {
      $match: match,
    },
    {
      // populate Author
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'user',
      },
    },
    // check for author supplied or not
    // ! WTF IAM DOING ...
    author
      ? {
          $match: {
            $or: [
              { 'user.0.firstName': new RegExp(`${author}`, 'i') },
              { 'user.0.lastName': new RegExp(`${author}`, 'i') },
            ],
          },
        }
      : {
          $match: {},
        },
    {
      $sort: {
        createdAt: -1,
      },
    },
    { $limit: 5 },
    {
      $project: {
        title: 1,
        body: 1,
        photo: 1,
        slug: 1,
        createdAt: 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.slug': 1,
      },
    },
  ]);

  res.json(blogs);
};

module.exports = {
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogBySlug,
  getBlogs,
  searchForBlog,
};
