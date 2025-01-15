const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require('../Controllers/authControllers');

router.use(protect);
const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder
} = require('../Controllers/orderControllers');

router.route('/:cartId').post(allowedTo('user'), createCashOrder);

router.get(
  '/',
  allowedTo('user', 'admin', 'manager'),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get('/:id', findSpecificOrder);

module.exports = router;
