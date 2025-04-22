const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { createUser } = require("../controllers/userController");
// Routes won't be protected signUp, login, forgotPassword, resetPassword
router.post("/signUp", signUp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);
// Protected routes requires you to be authenticated
// router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

// Routes only for admin
router.route("/user").post(createUser);

module.exports = router;
