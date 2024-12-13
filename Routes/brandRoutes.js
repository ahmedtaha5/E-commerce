const express = require('express');

const router = express.Router();

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator
} = require('../utils/validators/brandValidator');

const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../Controllers/brandControllers');

router
  .route('/')
  .get(getAllBrands)
  .post(createBrandValidator, createBrand);

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .patch(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;

// api/v1/categories/:categoryId/subCategories ;
// api/v1/categories/categoryId/reviews
