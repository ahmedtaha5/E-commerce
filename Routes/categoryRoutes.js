const express = require('express');

const router = express.Router();

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../Controllers/categoryControllers');

router
  .route('/')
  .get(getAllCategories)
  .post(createCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
