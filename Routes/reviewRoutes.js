const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator
} = require('../utils/validators/reviewValidator');

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  sendProductIdAndUserIdtoIdBody
} = require('../Controllers/reviewControllers');

router
  .route('/')
  .get(createFilterObj, getAllReviews)
  .post(
    protect,
    allowedTo('user'),
    sendProductIdAndUserIdtoIdBody,
    createReviewValidator,
    createReview
  );

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .patch(protect, allowedTo('user'), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo('user', 'admin', 'manager'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
