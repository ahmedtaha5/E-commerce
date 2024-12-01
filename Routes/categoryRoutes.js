const express = require('express');

const router = express.Router();

const {
  getAllCategories,
  createCategory,
  getCategory
} = require('../Controllers/categoryControllers');

router
  .route('/')
  .get(getAllCategories)
  .post(createCategory);

router.route('/:id').get(getCategory);

module.exports = router;
