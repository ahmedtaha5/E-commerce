const SubCategory = require('../Models/subCategoryModel');
const handlerFactory = require('../Controllers/handlerFactory');

exports.sendCategoryIdBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = handlerFactory.createOne(SubCategory);

exports.updateSubCategory = handlerFactory.updateOne(SubCategory);

exports.deleteSubCategory = handlerFactory.updateOne(SubCategory);

exports.getAllSubCategories = handlerFactory.getAll(SubCategory);

exports.getSubCategory = handlerFactory.deleteOne(SubCategory);
