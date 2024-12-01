const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the category.'],
      unique: [true, 'category must be unique'],
      minLength: 3,
      maxlength: [50, 'Name should not exceed 50 characters.']
    },
    slug: {
      type: String,
      lowercase: true
    }
  },
  { timestamps: true }
);
categorySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;
