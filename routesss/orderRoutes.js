const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require('../Controllers/authControllers');
const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDeliverd,
  checkoutSession
} = require('../Controllers/orderControllers');

// Apply protect middleware to all routes
router.use(protect);

// Routes for users
router.post('/:cartId', allowedTo('user'), createCashOrder);
router.post('/checkout-session/:cartId', allowedTo('user'), checkoutSession); // Create Stripe checkout session

// Routes for users, admins, and managers
router.get(
  '/',
  allowedTo('user', 'admin', 'manager'),
  filterOrderForLoggedUser,
  findAllOrders
); // Get all orders
router.get('/:id', allowedTo('user', 'admin', 'manager'), findSpecificOrder); // Get specific order

// Routes for admins only
router.use(allowedTo('admin'));
router.put('/:orderId/pay', updateOrderToPaid);
router.put('/:orderId/deliver', updateOrderToDeliverd);

module.exports = router;
