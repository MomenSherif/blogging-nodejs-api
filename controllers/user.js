const User = require('../models/User');
const CustomError = require('../helper/CustomError');

const createUser = async (req, res) => {
  const user = new User(req.body);
  const [token] = await Promise.all([user.genereateAuthToken(), user.save()]);
  res.status(201).json({ user, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials({ email, password });

  if (!user) throw new CustomError(401, 'Invalid email or password!');

  const token = await user.genereateAuthToken();
  res.json({ user, token });
};

const getUserBySlug = async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) throw new CustomError(404, 'Not Found');
  res.json(user);
};

const followUser = async (req, res) => {
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

module.exports = {
  createUser,
  loginUser,
  getUserBySlug,
  followUser,
};
