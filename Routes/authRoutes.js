const express = require('express');

const router = express.Router();

const {
  signupValidator,
  loginValidator,
  resetPasswordValidator
} = require('../utils/validators/authValidator');

const {
  signup,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword
} = require('../Controllers/authControllers');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgetPassword);
router.post('/verifyResetCode', verifyPasswordResetCode);
router.patch('/resetPassword', resetPasswordValidator, resetPassword);
module.exports = router;
