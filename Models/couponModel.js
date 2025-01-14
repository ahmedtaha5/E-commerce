const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Coupon name required'],
      unique: true
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expire time required']
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount value required']
    },
    usageLimit: {
      // Number of times the coupon can be used
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
