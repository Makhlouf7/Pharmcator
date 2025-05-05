const Product = require("../models/productsModel");
const Cart = require("../models/cartModel");
const skipError = require("../utils/skipError");

const initializeCart = (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
};

const mergeSessionCart = async (req, res, next) => {
  if (!req.user) return next();

  if (!req.session.cart || req.session.cart.length === 0) return next();

  let userCart = await Cart.findOne({ user: req.user._id });

  if (!userCart) {
    userCart = await Cart.create({ user: req.user._id, items: [] });
  }

  req.session.cart.forEach((sessionItem) => {
    const existingItem = userCart.items.find(
      (dbItem) => dbItem.product.toString() === sessionItem.productId
    );

    if (existingItem) {
      existingItem.quantity += sessionItem.quantity;
    } else {
      userCart.items.push({
        product: sessionItem.productId,
        quantity: sessionItem.quantity,
      });
    }
  });

  await userCart.save();
  req.session.cart = [];
  next();
};

const getCartItems = skipError(async (req, res, next) => {
  if (req.user) {
    const userCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    return res.status(200).json({
      status: "success",
      data: userCart ? userCart.items : [],
    });
  }

  // Guest
  return res.status(200).json({
    status: "success",
    data: req.session.cart,
  });
});

const updateCartItem = skipError(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid quantity",
    });
  }
  // Logged in user
  if (req.user) {
    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }

    const item = userCart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;
    await userCart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
    });

    return res.status(200).json({
      status: "success",
      data: populatedCart.items,
    });
  }

  // Guest
  const sessionItem = req.session.cart.find(
    (item) => item.productId == productId
  );

  if (!sessionItem) {
    return res.status(404).json({
      status: "fail",
      message: "Product not found in cart",
    });
  }

  sessionItem.quantity = quantity;

  res.status(200).json({
    status: "success",
    data: req.session.cart,
  });
});

const addCartItem = skipError(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const product = await Product.findById(productId);

  if (!quantity || !product) {
    return res.status(400).json({ status: "fail" });
  }
  // Logged in user
  if (req.user) {
    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      userCart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = userCart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(200).json({
        status: "success",
        message: "Product already exist",
      });
    } else {
      userCart.items.push({ product: productId, quantity });
    }

    await userCart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
    });

    return res.status(200).json({
      status: "success",
      message: "Product added successfully",
      data: populatedCart.items,
    });
  }
  // Guest
  if (req.session.cart.find((item) => item.productId == productId))
    return res.status(200).json({
      status: "success",
      message: "Product already exist",
    });
  req.session.cart.push({
    productId,
    product,
    quantity,
  });

  res.status(200).json({
    status: "success",
    message: "Product added successfully",
    data: req.session.cart,
  });
});

const deleteCartItem = skipError(async (req, res, next) => {
  const { productId } = req.params;
  // Logged in user
  if (req.user) {
    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }

    const itemIndex = userCart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found in cart",
      });
    }

    userCart.items.splice(itemIndex, 1);

    await userCart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
    });

    return res.status(200).json({
      status: "success",
      data: populatedCart.items,
    });
  }

  // Guest
  const exists = req.session.cart.find((item) => item.productId == productId);

  if (!exists) {
    return res.status(404).json({
      status: "fail",
      message: "Product not found in cart",
    });
  }

  req.session.cart = req.session.cart.filter(
    (item) => item.productId != productId
  );

  res.status(200).json({
    status: "success",
    data: req.session.cart,
  });
});

module.exports = {
  initializeCart,
  getCartItems,
  updateCartItem,
  addCartItem,
  deleteCartItem,
  mergeSessionCart,
};
