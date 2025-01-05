const express = require('express');

const router = express.Router();

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
} = require('../utils/validators/brandValidator');

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage
} = require('../Controllers/brandControllers');

router
  .route('/')
  .get(getAllBrands)
  .post(
    protect,
    allowedTo('admin'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route('/:id')
  .get(protect, allowedTo('admin', 'manager'), getBrandValidator, getBrand)
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;

// api/v1/categories/:categoryId/subCategories ;
// api/v1/categories/categoryId/reviews
