const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist
} = require('../Controllers/wishlistControllers');

router
  .route('/')
  .get(protect, allowedTo('user'), getLoggedUserWishlist)
  .post(protect, allowedTo('user'), addProductToWishlist);

router
  .route('/:id')
  .delete(protect, allowedTo('user'), removeProductFromWishlist);

module.exports = router;

// api/v1/categories/:categoryId/subCategories ;
// api/v1/categories/categoryId/reviews
