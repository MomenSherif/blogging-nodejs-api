const express = require('express');

const {
  validateRegisterationCredentials,
  validateLoginCredentials,
} = require('../middlewares/user');
const { authenticate } = require('../middlewares/auth');
const {
  createUser,
  loginUser,
  getUserBySlug,
  getUserBlogsBySlug,
  followUser,
  getFollowedUsersBlogs,
} = require('../controllers/user');

const { sanitizeBlogPagePagination } = require('../middlewares/blog');

const router = express.Router();

router.post('/', validateRegisterationCredentials, createUser);

router.post('/login', validateLoginCredentials, loginUser);

router.post('/:id/follow', authenticate, followUser);

router.get(
  '/followed/blogs',
  authenticate,
  sanitizeBlogPagePagination,
  getFollowedUsersBlogs
);

router.get('/:slug', authenticate, getUserBySlug);

router.get(
  '/:slug/blogs',
  authenticate,
  sanitizeBlogPagePagination,
  getUserBlogsBySlug
);

module.exports = router;
