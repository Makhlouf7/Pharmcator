const express = require("express");
const {
  getDashboard,
  getCategories,
  getCategoriesAdd,
  getCategoriesEdit,
  getProducts,
  getProductsAdd,
  getProductsEdit,
} = require("../controllers/dashboardController");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

// Protect all routes in this router
// router.use(protect);

// Restrict access to admin users
router.get("/", getDashboard);
router.get("/inventory/categories", getCategories);
router.get("/inventory/categories/add", getCategoriesAdd);
router.get("/inventory/categories/edit/:id", getCategoriesEdit);
router.get("/inventory/products/add", getProductsAdd);
router.get("/inventory/products/edit/:id", getProductsEdit);
router.get("/inventory/products", getProducts);

module.exports = router;
