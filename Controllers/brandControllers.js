const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const Brand = require('../Models/brandModel');
const handlerFactory = require('../Controllers/handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(320, 240)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});

exports.uploadBrandImage = uploadSingleImage('image');

exports.getAllBrands = handlerFactory.getAll(Brand);

exports.getBrand = handlerFactory.getOne(Brand);

exports.createBrand = handlerFactory.createOne(Brand);

exports.updateBrand = handlerFactory.updateOne(Brand);

exports.deleteBrand = handlerFactory.deleteOne(Brand);
