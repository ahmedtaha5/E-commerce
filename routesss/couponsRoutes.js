const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../Controllers/couponsControllers');

router.use(protect, allowedTo('admin', 'manager'));
router
  .route('/')
  .get(getAllCoupons)
  .post(createCoupon);

router
  .route('/:id')
  .get(getCoupon)
  .patch(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
