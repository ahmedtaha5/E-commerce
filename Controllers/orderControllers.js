const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const Order = require('../Models/orderModel');
const handlerFactory = require('../Controllers/handlerFactory');

const Product = require('../Models/productModel');
//const Coupon = require('../Models/couponModel');
const Cart = require('../Models/cartModel');
const User = require('../Models/userModel');

// api/v1/orders/cartId
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingAddress = 0;
  const shippingPrice = 0;
  // 1) Get cart based on cartId
  const { cartId } = req.params;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new AppError(`Cart not found`, 404));
  }
  // 2) Get order price based on cart price "check if any coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + shippingAddress + shippingPrice;
  // 3) create order with default payment method type >> cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice
  });
  // 4) after creating order, decrement quantity and increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }));
    try {
      await Product.bulkWrite(bulkOption, {});
    } catch (error) {
      return next(new AppError('Failed to update product quantities', 500));
    }
  }
  // 5) clear cart based on cartId
  try {
    await Cart.findByIdAndDelete(cartId);
  } catch (error) {
    return next(new AppError('Failed to delete cart', 500));
  }

  res.status(201).json({
    status: 'success',
    data: order
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
});

exports.findAllOrders = handlerFactory.getAll(Order);

exports.findSpecificOrder = handlerFactory.getOne(Order);

// api/v1/order/:orderId/pay
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: 'success',
    data: updatedOrder
  });
});

// api/v1/order/:id/deliver
exports.updateOrderToDeliverd = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: 'success',
    data: updatedOrder
  });
});

// api/v1/order/checkout-session/:cartId
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get the cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError(`Cart not found`, 404));
  }

  // 2) Calculate the total order price
  const taxPrice = 0;
  const shippingPrice = 0;
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create a Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Specify payment methods
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name
          },
          unit_amount: totalOrderPrice * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment', // Payment mode
    success_url: `${req.protocol}://${req.get('host')}/order`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    metadata: {
      shippingAddress: req.body.shippingAddress, // Add shipping address to metadata
      cartId: req.params.cartId // Add cart ID to metadata
    },
    client_reference_id: req.params.cartId // Reference ID for the cart
  });

  // 4) Send the session as a response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createCardOrder = async session => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    totalOrderPrice: cart.totalOrderPrice / 100,
    cartItems: cart.cartItems,
    shippingAddress: shippingAddress,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card'
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }));
    await Product.bulkWrite(bulkOptions, {});

    // clear cart
    await cart.findByIdAndDelete(cartId);
  }
};

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    console.log('create order hereeeeeee !!!!!!!');
    // create order
    createCardOrder(event.data.object);
  }
});
