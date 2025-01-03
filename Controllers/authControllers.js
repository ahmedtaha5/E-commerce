const crypto = require('crypto');
//const ms = require('ms');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const User = require('../Models/userModel');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// Cookie options
const cookieOptions = {
  expires: process.env.JWT_REFRESH_EXPIRE, // Convert "7d" to milliseconds
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
};

const sendResponse = async (res, user, code) => {
  const token = generateToken(user._id);

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_TOKEN, // Ensure this environment variable is set correctly
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  // Set the cookie
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Send the response
  res.status(code).json({
    success: true,
    token,
    refreshToken,
    user
  });
};

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone
  });
  // Exclude password from response
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone
  };
  sendResponse(res, userData, 201);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if user exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  // Generate JWT token
  user.password = undefined;
  sendResponse(res, user, 201);
});

exports.protect = asyncHandler(async (req, res, next) => {
  // check if the token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in. Please log in.', 401));
  }
  // 2) verify the token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if the user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppError('User not found. Please log in.', 401));
  }
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new AppError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }
  if (!currentUser.active) {
    return next(
      new AppError('Your account is not active. Please contact support.', 403)
    );
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    // Return the middleware function
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Access denied. Allowed roles: ${roles.join(', ')}`, 403)
      );
    }
    next();
  });
};

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await User.findOne({ email: req.body.email });
  // 2) check if the user exists
  if (!user) {
    return next(
      new AppError(`there is no user with this email ${req.body.email}`),
      404
    );
  }
  // 3) if user exists >> generate a random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetverified = false;
  await user.save();
  // 4) send the code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code (valid for 10 minutes)',
      message: message
    });
  } catch (err) {
    console.error('Email sending error:', err); // Log the actual error for debugging
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new AppError('Failed to send reset code. Please try again later.', 500)
    );
  }
  // sending response
  sendResponse(res, { message: 'Reset code sent successfully.' }, 200);
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  // 1) get user by hashed code
  const hashResetCode = crypto
    .createHash('sha256')
    .update(req.body.passwordResetCode)
    .digest('hex');
  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(new AppError('Invalid or expired reset code', 400));
  }
  // 2) code valid
  user.passwordResetverified = true;
  await user.save();
  res
    .status(200)
    .json({ success: true, message: 'Code verified successfully' });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  // Validate inputs
  if (!password || !passwordConfirm) {
    return next(
      new AppError(
        'Please provide both password and password confirmation.',
        400
      )
    );
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match.', 400));
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user found with that email address.', 404));
  }

  // Check if password reset is verified
  if (!user.passwordResetverified) {
    return next(new AppError('Password reset code is not verified.', 400));
  }

  // Hash the new password before saving (assuming bcrypt is being used)
  user.password = await bcrypt.hash(password, 12);

  // Clear reset-related fields
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetverified = undefined;

  // Save the updated user
  await user.save();

  sendResponse(
    res,
    { message: 'Password updated successfully. You can now log in.' },
    200
  );
});

// Refresh token handler
exports.refresh = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line
  const refreshToken = req.cookies.refreshToken;
  console.log(`refresh token: ${refreshToken}`);
  // Check if refresh token exists
  if (!refreshToken) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_refresh_Token);
    console.log(decoded);

    // Find the user by ID from the decoded token
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return next(new AppError('Refresh token is not valid', 403));
    }
    // Generate a new access token

    // Send the new token in the response
    sendResponse(res, existingUser._id, 200);
  } catch (err) {
    // Handle invalid or expired refresh tokens
    return next(new AppError('Refresh token is not valid', 403));
  }
});

// Logout handler
exports.logout = asyncHandler(async (req, res, next) => {
  if (!req.cookies.refreshToken) {
    return res.status(204).json({ status: 'success' });
  }

  const { refreshToken } = req.cookies;

  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(204).json({ status: 'success' });
  }

  user.refreshToken = '';
  await user.save();

  res.clearCookie('refreshToken', cookieOptions);
  return res.status(200).json({ status: 'success' });
});
