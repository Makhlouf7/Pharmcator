const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Crypto = require("crypto");
const redirectUser = (req, res, next) => {
  if (res.locals.user) res.render("index.ejs");
  next();
};

const getMain = async (req, res, next) => {
  const categories = await Category.find();
  res.render("index", {
    categories,
  });
};

const getProductsInCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  console.log(categoryId);
  const products = await Product.find({ category: categoryId });
  const category = await Category.findById(categoryId);
  res.render("productsInCategory", {
    products,
    category,
  });
};

const getProductDetails = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ product: productId }).populate({
    path: "user",
    select: "image fullName",
  });
  res.render("productDetails", {
    product,
    reviews,
  });
};

const getCart = async (req, res, next) => {
  let cart;
  if (req.user)
    cart =
      (
        await Cart.findOne({ user: req.user._id }).populate({
          path: "items.product",
        })
      )?.items || [];
  else cart = req.session.cart;
  console.log(cart);
  res.render("cart", {
    cart,
  });
};

const getSign = (req, res) => {
  res.render("sign");
};

const getRegister = (req, res) => {
  res.render("register");
};

const getForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

const getResetPassword = async (req, res, next) => {
  console.log("Entered get Reset");
  const { token } = req.params;
  const encryptedToken = Crypto.createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({ passwordResetToken: encryptedToken });
  if (!user) {
    console.log("User not exist 💥💥");
    next();
    return;
  }

  res.render("resetPassword", {
    token,
  });
};

module.exports = {
  redirectUser,
  getMain,
  getProductsInCategory,
  getProductDetails,
  getCart,
  getSign,
  getRegister,
  getForgotPassword,
  getResetPassword,
};
