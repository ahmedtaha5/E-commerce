const asyncHandler = require('express-async-handler');

const slugify = require('slugify');
const mongoose = require('mongoose');
const categoryModel = require('../Models/categoryModel');

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;
  const categories = await categoryModel
    .find({})
    .skip(skip)
    .page(page)
    .limit(limit);
  if (!categories) {
    return next(new Error('No categories found!'));
  }
  res.status(200).json({
    success: true,
    count: categories.length,
    data: {
      categories
    }
  });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      msg: `Category not found for the id: ${id}`
    });
  }
  const category = await categoryModel.findById(id);
  res.status(200).json({
    success: true,
    data: {
      category
    }
  });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({
    name,
    slug: slugify(name)
  });
  res.status(201).json({
    success: true,
    data: {
      category
    }
  });
});
