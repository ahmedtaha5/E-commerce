const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const {
  uploadMultipleImages
} = require('./../Middlewares/uploadImageMiddleware');
const handlerFactory = require('../Controllers/handlerFactory');
const Product = require('../Models/productModel');

exports.uploadProductImages = uploadMultipleImages([
  {
    name: 'imageCover',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 8
  }
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `Product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    const images = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const imageFileName = `product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`;
      sharp(req.files.images[i].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imageFileName}`);
      images.push(imageFileName);
    }
    req.body.images = images;
  }
  next();
});

exports.getAllProducts = handlerFactory.getAll(Product);

exports.getProduct = handlerFactory.getOne(Product);

exports.createProduct = handlerFactory.createOne(Product);

exports.updateProduct = handlerFactory.updateOne(Product);

exports.deleteProduct = handlerFactory.deleteOne(Product);
