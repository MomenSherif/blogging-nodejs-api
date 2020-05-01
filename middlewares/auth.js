const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const CustomError = require('../helper/CustomError');
const User = require('../models/User');
const { jwtSecretKey } = require('../config');

const jwtVerify = promisify(jwt.verify);

const authenticate = async (req, res, next) => {
  if (!req.headers.authorization) throw new CustomError(401, 'Unauthorized!');

  const token = req.headers.authorization.replace('Bearer ', '');
  const { _id } = await jwtVerify(token, jwtSecretKey).catch((e) => {
    throw new CustomError(401, 'Unauthorized Expired Token!');
  });

  req.user = await User.findById(_id);
  next();
};

module.exports = {
  authenticate,
};
