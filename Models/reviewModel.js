const mongoose = require('mongoose');

const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Review title is required'],
      minLength: [3, 'Review title must be at least 5 characters long'],
      maxLength: [100, 'Review title must not exceed 100 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a rating for the review.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user']
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product']
    }
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatingsAndQuantity = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: 'product',
        averageRating: { $avg: '$rating' },
        ratingQuantity: { $sum: 1 }
      }
    }
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].averageRating,
      ratingsQuantity: result[0].ratingQuantity
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0
    });
  }
};

reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('remove', async function() {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
