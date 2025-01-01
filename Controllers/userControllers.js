const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const User = require('../Models/userModel');
const handlerFactory = require('../Controllers/handlerFactory');
const { uploadSingleImage } = require('../Middlewares/uploadImageMiddleware');
const AppError = require('../utils/appError');
const generateToken = require('../utils/generateToken');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(320, 240)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.image = filename;
  }
  next();
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now()
    },
    {
      new: true
    }
  );

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.uploadUserImage = uploadSingleImage('profileImg');

exports.getAllUsers = handlerFactory.getAll(User);

exports.getUser = handlerFactory.getOne(User);

exports.createUser = handlerFactory.createOne(User);

exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);

exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now()
    },
    {
      new: true
    }
  );
  const token = generateToken(user._id);
  res.status(200).json({
    success: true,
    token
  });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    },
    { new: true }
  );
  res.status(200).json({
    data: updatedUser
  });
});
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(200).json({ success: true });
});
