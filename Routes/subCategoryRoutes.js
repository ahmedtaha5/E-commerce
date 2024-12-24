const express = require('express');

const router = express.Router({ mergeParams: true });

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} = require('./../utils/validators/subCategoryValidator');

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  getSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
  createSubCategory,
  sendCategoryIdBody
} = require('./../Controllers/subCategoryControllers');

router
  .route('/')
  .get(protect, allowedTo('admin', 'manager'), getAllSubCategories)
  .post(
    protect,
    allowedTo('admin'),
    sendCategoryIdBody,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route('/:id')
  .get(
    protect,
    allowedTo('admin', 'manager'),
    getSubCategoryValidator,
    getSubCategory
  )
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo('admin'),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
