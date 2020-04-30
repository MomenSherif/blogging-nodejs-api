const express = require('express');
const {
  validateRegisterationCredentials,
  validateLoginCredentials,
} = require('../middlewares/user');
const { createUser, loginUser } = require('../controllers/user');

const router = express.Router();

router.post('/', validateRegisterationCredentials, createUser);

router.post('/login', validateLoginCredentials, loginUser);

module.exports = router;
