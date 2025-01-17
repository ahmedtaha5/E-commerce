const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require('../Controllers/authControllers');

router.use(protect);
const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  createSession
} = require('../Controllers/orderControllers');

router.route('/:cartId').post(allowedTo('user'), createCashOrder);

router.get(
  '/',
  allowedTo('user', 'admin', 'manager'),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get('/:id', findSpecificOrder);

router.get('/checkout-session/:cartId', allowedTo('user'), createSession);

router.use(allowedTo('admin'));
router.put('/:orderId/pay', updateOrderToPaid);
router.put('/:orderId/deliver', updateOrderToDeliverd);

module.exports = router;
