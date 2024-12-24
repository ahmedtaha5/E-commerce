const express = require('express');

const router = express.Router();

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} = require('../utils/validators/productValidator');

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImage
} = require('../Controllers/productControllers');

router
  .route('/')
  .get(getAllProducts)
  .post(
    protect,
    allowedTo('admin'),
    uploadProductImages,
    resizeProductImage,
    createProductValidator,
    createProduct
  );

router
  .route('/:id')
  .get(protect, allowedTo('admin', 'manager'), getProductValidator, getProduct)
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    uploadProductImages,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo('admin'), deleteProductValidator, deleteProduct);

module.exports = router;
