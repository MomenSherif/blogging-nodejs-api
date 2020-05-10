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
  searchForBlog,
} = require('../controllers/blog');

const router = express.Router();

router.get('/search', authenticate, searchForBlog);

router.post('/', authenticate, uploadPhoto, validateBlogCreation, createBlog);

router.delete('/:id', authenticate, validateBlogOwner, deleteBlog);

router.patch(
  '/:id',
  authenticate,
  validateBlogOwner,
  uploadPhoto,
  validateBlogUpdate,
  updateBlog
);

router.get('/:slug', getBlogBySlug);

router.get('/', sanitizeBlogPagePagination, getBlogs);

module.exports = router;
