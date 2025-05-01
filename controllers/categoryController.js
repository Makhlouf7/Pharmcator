const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const fs = require("fs/promises");
const path = require("path");
const {
  createOne,
  deleteOne,
  getAll,
  updateOne,
} = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createCategory = createOne(Category);

const getAllCategories = getAll(Category);

const getAllProductsInCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const allProducts = await Product.find({ category: id });

  res.status(200).json({
    status: "success",
    data: allProducts,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return next(new AppError("No document found", 404));
  // Delete current image
  if (req.body.image) {
    try {
      console.log(category.image);
      await fs.unlink(path.join(__dirname, `../public${category.image}`));
    } catch {
      // Skip deletion
    }
  }
  const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: updateCategory,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // Delete all Products in the category
  const deletedProducts = await Product.find({ category: id });
  for (const doc of deletedProducts) {
    try {
      await fs.unlink(path.join(__dirname, `../public${doc.image}`));
    } catch {
      // Skip deletion
      continue;
    }
  }
  await Product.deleteMany({ category: id });
  // Delete the category
  const deletedCategory = await Category.findByIdAndDelete(id);
  try {
    await fs.unlink(path.join(__dirname, `../public${deletedCategory.image}`));
  } catch {
    // Skip deletion
  }
  res.status(204).json({ status: "success", data: null });
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getAllProductsInCategory,
};
