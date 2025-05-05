const express = require("express");
const {
  getForgotPassword,
  getMain,
  getProductsInCategory,
  getProductDetails,
  getRegister,
  getSign,
  getResetPassword,
  redirectUser,
  getCart,
} = require("../controllers/viewController");
const { initializeCart } = require("../controllers/cartController");
const { isUserLoggedIn } = require("../controllers/authController");
const router = express.Router();

// Check if there is a logged in user to change the template based on it
router.use("/", isUserLoggedIn);

router.get("/", getMain);
router.get("/category/:categoryId", getProductsInCategory);
router.get("/product/:productId", getProductDetails);
router.get("/cart", initializeCart, getCart);
// if user was logged in and asked for these routes redirect him to home page
router.get("/sign", getSign);
router.get("/register", getRegister);
router.get("/forgotPassword", getForgotPassword);
router.get("/resetPassword/:token", getResetPassword);

module.exports = router;
