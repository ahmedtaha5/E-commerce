const slugify = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../Middlewares/validatorMiddleware');
const User = require('../../Models/userModel');

exports.getUserValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid User id format'),
  validatorMiddleware
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(val => {
      return User.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('Email is already in use'));
        }
      });
    }),
  check('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('passwort must be at least 8 characters'),
  check('phone')
    .optional()
    .isMobilePhone(['ar-SA', 'ar-EG'])
    .withMessage('invalid phone number only accepted EGY and SA phone numbers'),
  check('profileImg').optional(),
  validatorMiddleware
];

exports.updateUserValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
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
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  check('role').optional(),
  validatorMiddleware
];
exports.changeUserPasswordValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
  validatorMiddleware
];

exports.deleteUserValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid User id format'),
  validatorMiddleware
];
