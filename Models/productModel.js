const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Product title is required'],
      minLength: [3, 'Title must be at least 3 chars'],
      maxLength: [100, 'Title must be at most 100 chars']
    },
    slug: {
      type: String,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minLength: [20, 'Description must be at least 20 chars'],
      maxLength: [1000, 'Description must be at most 1000 chars']
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required']
    },
    sold: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      max: [250000, 'Product price must be at most 250,000']
    },
    priceAfterDiscount: {
      type: Number
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'Product cover image is required']
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to category!']
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
      }
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand'
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      default: 4.5,
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    // enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'category',
    select: 'name -_id'
  });
  next();
});

const setImageUrl = doc => {
  if (doc.imageCover) {
    const imageCoverURL = `${process.env.BaseUrl}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverURL;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach(image => {
      const imagesURLs = `${process.env.BaseUrl}/products/${image}`;
      imagesList.push(imagesURLs);
    });
    doc.images = imagesList;
  }
};

productSchema.post('init', doc => {
  setImageUrl(doc);
});
productSchema.post('save', doc => {
  setImageUrl(doc);
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
