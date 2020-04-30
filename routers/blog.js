const express = require('express');

const {
  validateBlogCreation,
  validateBlogOwner,
  validateBlogUpdate,
  uploadPhoto,
} = require('../middlewares/blog');
const { authenticate } = require('../middlewares/auth');
const { createBlog, deleteBlog, updateBlog } = require('../controllers/blog');

const router = express.Router();

router.post('/', authenticate, uploadPhoto, validateBlogCreation, createBlog);

router.delete('/:id', authenticate, validateBlogOwner, deleteBlog);

router.patch(
  '/:id',
  authenticate,
  uploadPhoto,
  validateBlogOwner,
  validateBlogUpdate,
  updateBlog
);

module.exports = router;
