const path = require('path');
const { body, query } = require('express-validator');
const multer = require('multer');

const validateRequest = require('../middlewares/validateRequest');
const Blog = require('../models/Blog');
const CustomError = require('../helper/CustomError');
const validateRequestExtraFields = require('../middlewares/validateRequestExtraFields');

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter(req, file, cb) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) cb(null, true);
    else cb(new CustomError(422, 'Images only are allowed!'));
  },
  limits: {
    fileSize: (1024 * 1024) / 2, // 0.5MB
  },
});

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
  body('photo') // Custom validator for image upload only
    .custom((value, { req }) =>
      req.file ? req.file.mimetype.startsWith('image') : false
    )
    .withMessage('Images only are allowed!'),
  body('tags').customSanitizer((value) => JSON.parse(value)),
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
  body('photo')
    .optional()
    .custom((value, { req }) =>
      req.file ? req.file.mimetype.startsWith('image') : false
    )
    .withMessage('Images only are allowed!'),
  body('tags')
    .optional()
    .customSanitizer((value) => JSON.parse(value)),
  ...validateRequestExtraFields('author'),
]);

const validateBlogOwner = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) throw new CustomError(404, 'Not Found');

  if (blog.author.toString() !== req.user._id.toString())
    throw new CustomError(403, "You don't have permission!");

  req.blog = blog;
  next();
};

const uploadPhoto = upload.single('photo');

const sanitizeBlogPagePagination = validateRequest([
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pagesize').optional().isInt({ min: 1 }).toInt(),
]);

module.exports = {
  validateBlogCreation,
  validateBlogOwner,
  validateBlogUpdate,
  uploadPhoto,
  sanitizeBlogPagePagination,
};
