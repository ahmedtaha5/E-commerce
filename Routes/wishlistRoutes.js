const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  addProductToWishlist,
  deleteProductfromWishlist,
  getAllWishlist
} = require('../Controllers/wishlistControllers');

router
  .route('/')
  .get(protect, allowedTo('user'), getAllWishlist)
  .post(protect, allowedTo('user'), addProductToWishlist);

router
  .route('/:id')
  .delete(protect, allowedTo('user'), deleteProductfromWishlist);

module.exports = router;

// api/v1/categories/:categoryId/subCategories ;
// api/v1/categories/categoryId/reviews
