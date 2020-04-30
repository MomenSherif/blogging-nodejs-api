const express = require('express');
const {
  validateRegisterationCredentials,
  validateLoginCredentials,
} = require('../middlewares/user');
const { authenticate } = require('../middlewares/auth');
const { createUser, loginUser, getUserBySlug } = require('../controllers/user');

const router = express.Router();

router.post('/', validateRegisterationCredentials, createUser);

router.post('/login', validateLoginCredentials, loginUser);

router.get('/:slug', authenticate, getUserBySlug);

module.exports = router;
