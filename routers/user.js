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
  followUser,
} = require('../controllers/user');

const router = express.Router();

router.post('/', validateRegisterationCredentials, createUser);

router.post('/login', validateLoginCredentials, loginUser);

router.get('/:slug', authenticate, getUserBySlug);

router.post('/:id/follow', authenticate, followUser);

module.exports = router;
