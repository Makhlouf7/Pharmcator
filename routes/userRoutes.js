const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  logoutUserCookie,
  renderResetForm,
} = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
// Routes won't be protected signUp, login, logout, forgotPassword, resetPassword
router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logoutUserCookie);
router.post("/forgotPassword", forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

router.use(protect);
// Protected routes requires authentication
// router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

// Routes only for admin
router.route("/user").post(createUser);

module.exports = router;
