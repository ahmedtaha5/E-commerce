const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide a name for the sub category.'],
      unique: [true, 'category must be unique'],
      minLength: [2, 'category must be at least 3 characters']
    },
    slug: {
      type: String,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Category must belong to a parent category.']
    }
  },
  { timestamps: true }
);
subCategorySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const subCategoryModel = mongoose.model('subCategory', subCategorySchema);
module.exports = subCategoryModel;
