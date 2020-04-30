const User = require('../models/User');

const createUser = async (req, res) => {
  const user = new User(req.body);
  const [token] = await Promise.all([user.genereateAuthToken(), user.save()]);
  res.status(201).json({ user, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials({ email, password });

  if (!user) throw new CustomError(401, 'Unauthorized');

  const token = await user.genereateAuthToken();
  res.json({ user, token });
};

module.exports = {
  createUser,
  loginUser,
};
