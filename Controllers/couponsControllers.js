//const asyncHandler = require('express-async-handler');

const Coupon = require('../Models/couponModel');
const handlerFactory = require('../Controllers/handlerFactory');

exports.getAllCoupons = handlerFactory.getAll(Coupon);

exports.getCoupon = handlerFactory.getOne(Coupon);

exports.createCoupon = handlerFactory.createOne(Coupon);

exports.updateCoupon = handlerFactory.updateOne(Coupon);

exports.deleteCoupon = handlerFactory.deleteOne(Coupon);
