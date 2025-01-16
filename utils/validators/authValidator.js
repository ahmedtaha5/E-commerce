const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../Middlewares/validatorMiddleware');
const User = require('../../Models/userModel');

exports.signupValidator = [
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(val =>
      User.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('passwort must be at least 8 characters'),
  check('phone')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  validatorMiddleware
];
exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required'),
  check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('passwort must be at least 8 characters'),
  validatorMiddleware
];
exports.resetPasswordValidator = [
  check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('passwort must be at least 8 characters'),
  validatorMiddleware
];
