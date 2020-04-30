const express = require('express');

const {
  validateBlogCreation,
  validateOwner,
  validateBlogUpdate,
} = require('../middlewares/blog');
const { authenticate } = require('../middlewares/auth');
const { createBlog, deleteBlog, updateBlog } = require('../controllers/blog');

const router = express.Router();

router.post('/', authenticate, validateBlogCreation, createBlog);

router.delete('/:id', authenticate, validateOwner, deleteBlog);

router.patch(
  '/:id',
  authenticate,
  validateOwner,
  validateBlogUpdate,
  updateBlog
);

module.exports = router;
