const express = require("express");
const router = express.Router();
const upload = require("../utils/uploadImage");
const compressResizeImage = require("../utils/compressResizeImage");
const {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productsController");

router
  .route("/")
  .get(getAllProducts)
  .post(
    upload.single("image"),
    compressResizeImage({ width: 500, height: 500, quality: 80 }),
    createProduct
  );
router
  .route("/:id")
  .patch(
    upload.single("image"),
    compressResizeImage({ width: 500, height: 500, quality: 80 }),
    updateProduct
  )
  .delete(deleteProduct);

module.exports = router;
