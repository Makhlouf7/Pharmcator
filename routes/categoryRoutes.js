const express = require("express");
const router = express.Router();
const upload = require("../utils/uploadImage");
const compressResizeImage = require("../utils/compressResizeImage");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProductsInCategory,
} = require("../controllers/categoryController");

router
  .route("/")
  .get(getAllCategories)
  .post(
    upload.single("image"),
    compressResizeImage({ width: 500, height: 500, quality: 80 }),
    createCategory
  );

router
  .route("/:id")
  .patch(
    upload.single("image"),
    compressResizeImage({ width: 500, height: 500, quality: 80 }),
    updateCategory
  )
  .delete(deleteCategory)
  .get(getAllProductsInCategory);

module.exports = router;
