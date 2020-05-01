const express = require('express');

const {
  validateBlogCreation,
  validateBlogOwner,
  validateBlogUpdate,
  uploadPhoto,
  sanitizeBlogPagePagination,
} = require('../middlewares/blog');
const { authenticate } = require('../middlewares/auth');
const {
  createBlog,
  deleteBlog,
  updateBlog,
  getBlogBySlug,
  getBlogs,
} = require('../controllers/blog');

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

router.get('/:slug', getBlogBySlug);
console.log('test');

router.get('/', sanitizeBlogPagePagination, getBlogs);

module.exports = router;
