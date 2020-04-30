const path = require('path');
const { body } = require('express-validator');
const multer = require('multer');

const validateRequest = require('../middlewares/validateRequest');
const Blog = require('../models/Blog');
const CustomError = require('../helper/CustomError');
const validateRequestExtraFields = require('../middlewares/validateRequestExtraFields');

// Blog photo multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) cb(null, true);
    else cb(new CustomError(422, 'Images only are allowed!'));
  },
  limits: {
    fileSize: 1024 * 1024, // 1MB
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

const validateBlogOwner = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) throw new CustomError(404, 'Not Found');

  if (blog.author.toString() !== req.user._id.toString())
    throw new CustomError(403, "You don't have permission!");

  req.blog = blog;
  next();
};

const uploadPhoto = upload.single('photo');

module.exports = {
  validateBlogCreation,
  validateBlogOwner,
  validateBlogUpdate,
  uploadPhoto,
};
