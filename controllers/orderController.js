const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");

const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: "success",
    data: orders,
  });
});

const createOrder = catchAsync(async (req, res, next) => {
  req.body.cartItems = JSON.parse(req.body.cartItems);
  const order = await Order.create(req.body);
  // Clear user cart
  const userCart = await Cart.findOne({ user: req.user._id });
  userCart.items = [];
  await userCart.save();

  res.status(201).json({
    status: "success",
    data: order,
  });
});

module.exports = { getAllOrders, createOrder };
