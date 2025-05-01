const express = require("express");
const {
  getForgotPassword,
  getMain,
  getRegister,
  getSign,
  redirectUser,
} = require("../controllers/viewController");
const { isUserLoggedIn } = require("../controllers/authController");
const router = express.Router();

// Check if there is a logged in user to change the template based on it
router.use("/", isUserLoggedIn);

router.get("/", getMain);
// if user was logged in and asked for these routes redirect him to home page

router.get("/sign", getSign);
router.get("/register", getRegister);
router.get("/forgotPassword", getForgotPassword);

module.exports = router;
