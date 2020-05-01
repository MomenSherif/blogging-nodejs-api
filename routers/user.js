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
} = require('../controllers/user');

const { sanitizeBlogPagePagination } = require('../middlewares/blog');

const router = express.Router();

router.post('/', validateRegisterationCredentials, createUser);

router.post('/login', validateLoginCredentials, loginUser);

router.get('/:slug', authenticate, getUserBySlug);

router.get(
  '/:slug/blogs',
  authenticate,
  sanitizeBlogPagePagination,
  getUserBlogsBySlug
);

router.post('/:id/follow', authenticate, followUser);

module.exports = router;
