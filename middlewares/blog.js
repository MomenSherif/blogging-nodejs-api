const { body } = require('express-validator');

const validateRequest = require('../middlewares/validateRequest');
const Blog = require('../models/Blog');
const CustomError = require('../helper/CustomError');
const validateRequestExtraFields = require('../middlewares/validateRequestExtraFields');

const validateBlogCreation = validateRequest([
  body('title')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters!')
    .notEmpty()
    .withMessage('Title must be provided'),
  body('body')
    .isLength({ min: 20 })
    .withMessage('Body must be at least 20 characters!')
    .notEmpty()
    .withMessage('Body must be provided!'),
  body('photo').notEmpty().withMessage('Photo must be provided!'),
]);

const validateBlogUpdate = validateRequest([
  body('title')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters!'),
  body('body')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Body must be at least 20 characters!'),
  ...validateRequestExtraFields('author'),
]);

const validateOwner = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) throw new CustomError(404, 'Not Found');

  if (blog.author.toString() !== req.user._id.toString())
    throw new CustomError(403, "You don't have permission!");

  req.blog = blog;
  next();
};

module.exports = {
  validateBlogCreation,
  validateOwner,
  validateBlogUpdate,
};
