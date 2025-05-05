const express = require("express");
const router = express.Router();
const upload = require("../utils/uploadImage");
const { isUserLoggedIn } = require("../controllers/authController");
const { getAllOrders, createOrder } = require("../controllers/orderController");

router.use(isUserLoggedIn);
router.route("/").get(getAllOrders).post(upload.single("image"), createOrder);

module.exports = router;
