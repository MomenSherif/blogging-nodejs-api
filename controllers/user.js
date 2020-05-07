const User = require('../models/User');
const Blog = require('../models/Blog');
const CustomError = require('../helper/CustomError');

const createUser = async (req, res) => {
  const user = new User(req.body);
  const [token] = await Promise.all([user.genereateAuthToken(), user.save()]);
  res.status(201).json({ user, token, message: 'Signed up Successfully' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials({ email, password });

  if (!user) throw new CustomError(401, 'Invalid email or password!');

  const token = await user.genereateAuthToken();
  res.json({ user, token, message: 'Logged in Successfully' });
};

// Use both in user profile
// Separated t 2 functions, to not request profile data while paginating blogs
const getUserBySlug = async (req, res) => {
  // couldn't use Promise.all, cus needs user id
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) throw new CustomError(404, 'User Not Found');

  const followers = await User.find({ follows: user._id }).count();
  res.json({ user, followers });
};

const getUserBlogsBySlug = async (req, res) => {
  const { page = 1, pagesize = 5 } = req.query;
  const user = await User.findOne({ slug: req.params.slug }).populate({
    path: 'blogs',
    select: 'title body photo createdAt slug tags',
    options: {
      sort: { createdAt: -1 },
      skip: (page - 1) * pagesize,
      limit: pagesize,
    },
  });
  if (!user) throw new CustomError(404, 'User Not Found');
  const count = await Blog.count({ author: user._id });
  const pages = Math.ceil(count / pagesize);
  res.json({ pages, blogs: user.blogs });
};

const followUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new CustomError(404, 'User Not Found!');

  const isFollowing = req.user.follows.some(
    (id) => id.toString() === req.params.id
  );
  const operator = isFollowing ? '$pull' : '$addToSet';
  const message = `${isFollowing ? 'UnFollowed' : 'Followed'} Successfully`;
  await req.user.updateOne({
    [operator]: {
      follows: req.params.id,
    },
  });
  res.json({ message });
};

const getFollowedUsersBlogs = async (req, res) => {
  const { page = 1, pagesize = 5 } = req.query;
  const blogsPromise = Blog.find({ author: req.user.follows })
    .populate({
      path: 'author',
      select: 'firstName lastName slug gender',
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pagesize)
    .limit(pagesize);

  const countPromise = Blog.count({ author: req.user.follows });
  const [count, blogs] = await Promise.all([countPromise, blogsPromise]);
  const pages = Math.ceil(count / pagesize);

  res.json({ pages, blogs });
};

module.exports = {
  createUser,
  loginUser,
  getUserBySlug,
  followUser,
  getUserBlogsBySlug,
  getFollowedUsersBlogs,
};
