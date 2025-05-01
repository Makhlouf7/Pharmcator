const Product = require("../models/productsModel");
const Category = require("../models/categoriesModel");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, getAll } = require("../controllers/handlerFactory");
const AppError = require("../utils/appError");

const createProduct = catchAsync(async (req, res, next) => {
  // Check if category exist
  const category = await Category.find({ _id: req.body.category });
  console.log(req.body);
  if (!category) return next(AppError("No product found", 404));
  // Create a product related to this product
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: product,
  });
});

const getAllProducts = getAll(Product);

const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // Delete the category
  const deletedProduct = await Product.findByIdAndDelete(id);
  try {
    await fs.unlink(path.join(__dirname, `../public${deletedProduct.image}`));
  } catch {
    // Skip deletion
  }
  res.status(204).json({ status: "success", data: null });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new AppError("No document found", 404));
  // Delete current image
  if (req.body.image) {
    try {
      await fs.unlink(path.join(__dirname, `../public${product.image}`));
    } catch {
      // Skip deletion
    }
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log("entered update product");
  res.status(200).json({
    status: "success",
    data: updatedProduct,
  });
});

module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProduct,
};
