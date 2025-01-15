const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the brand.'],
      unique: [true, 'brand must be unique'],
      minLength: [3, 'brand must be at least 3 characters'],
      maxlength: [32, 'Name should not exceed 50 characters.']
    },
    slug: {
      type: String,
      lowercase: true
    },
    image: String
  },
  { timestamps: true }
);
brandSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const setImageUrl = doc => {
  if (doc.image) {
    const imageURL = `${process.env.BaseUrl}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};
// (getOne, getAll, update) category
brandSchema.post('init', doc => {
  setImageUrl(doc);
});
// for create brand
brandSchema.post('save', doc => {
  setImageUrl(doc);
});

const brandModel = mongoose.model('brand', brandSchema);
module.exports = brandModel;
