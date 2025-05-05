const express = require("express");
const router = express.Router();
const {
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  initializeCart,
  mergeSessionCart,
} = require("../controllers/cartController");
const { isUserLoggedIn } = require("../controllers/authController");

router.use(initializeCart, isUserLoggedIn, mergeSessionCart);
router.get("/", getCartItems);
router
  .route("/:productId")
  .post(addCartItem)
  .patch(updateCartItem)
  .delete(deleteCartItem);

module.exports = router;
