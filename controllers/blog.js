const Blog = require('../models/Blog');
const CustomError = require('../helper/CustomError');
const cloudinary = require('../handlers/cloudinary');

const createBlog = async (req, res) => {
  const photo = await cloudinary.v2.uploader.upload(req.file.path);
  req.body.photo = photo.url;
  req.body.author = req.user._id;
  const blog = new Blog(req.body);
  await blog.save();
  res.status(201).json({ blog, message: 'Blog Created Successfully!' });
};

const updateBlog = async (req, res) => {
  // To trigger  pre save hook for [slug]

  if (req.file) {
    const photo = await cloudinary.v2.uploader.upload(req.file.path);
    req.body.photo = photo.url;
  }
  const updates = Object.keys(req.body);
  updates.forEach((update) => {
    req.blog[update] = req.body[update];
  });
  await req.blog.save();
  res.json({ blog: req.blog, message: 'Blog Updated Successfully!' });
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
    .populate({
      path: 'author',
      select: 'firstName lastName slug gender',
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pagesize)
    .limit(pagesize);
  const countPromise = Blog.countDocuments();
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
  const blogs = await Blog.aggregate([
    {
      $match: {
        title: {
          $regex: new RegExp(`${title}`, 'i'),
        },
        tags: tag
          ? {
              $regex: new RegExp(tag, 'i'),
            }
          : {
              $exists: true,
            },
      },
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
    {
      $unwind: '$user',
    },
    // check for author supplied or not
    // ! WTF IAM DOING ...
    author
      ? {
          $match: {
            $or: [
              { 'user.firstName': new RegExp(`${author}`, 'i') },
              { 'user.lastName': new RegExp(`${author}`, 'i') },
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
        tags: 1,
        slug: 1,
        createdAt: 1,
        'author.firstName': '$user.firstName',
        'author.lastName': '$user.lastName',
        'author.slug': '$user.slug',
        'author.gender': '$user.gender',
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
