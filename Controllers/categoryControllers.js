const asyncHandler = require('express-async-handler');
const sharp = require('sharp');

const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Category = require('../Models/categoryModel');
const handlerFactory = require('../Controllers/handlerFactory');

exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `Category-${uuidv4()}-${Date.now()}.jpeg`;
  if (!req.file) {
    return next(new Error('No file uploaded!'));
  }
  await sharp(req.file.buffer)
    .resize(320, 240)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  req.body.image = filename;
  next();
});

exports.getAllCategories = handlerFactory.getAll(Category);

exports.getCategory = handlerFactory.getOne(Category);

exports.createCategory = handlerFactory.createOne(Category);

exports.updateCategory = handlerFactory.updateOne(Category);

exports.deleteCategory = handlerFactory.deleteOne(Category);
