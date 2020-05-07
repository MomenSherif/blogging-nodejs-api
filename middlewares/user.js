const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');

const emailPasswordValidators = [
  body('email')
    .isEmail()
    .withMessage('Invalid Email Address!')
    .notEmpty()
    .withMessage('Email Address must be provided!'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters!')
    .notEmpty()
    .withMessage('Password must be provided!'),
];

const validateRegisterationCredentials = validateRequest([
  ...emailPasswordValidators,
  body('firstName').notEmpty().withMessage('First Name must be provided!'),
  body('lastName').notEmpty().withMessage('Last Name must be provided!'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('male | female are allowed!')
    .notEmpty()
    .withMessage('Gender must be provided!'),
]);

const validateLoginCredentials = validateRequest(emailPasswordValidators);

module.exports = {
  validateRegisterationCredentials,
  validateLoginCredentials,
};
