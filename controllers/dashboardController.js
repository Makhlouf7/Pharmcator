const Category = require("../models/categoriesModel");
const Product = require("../models/productsModel");
const getDashboard = async (req, res) => {
  const productsCount = await Product.countDocuments();
  const categoriesCount = await Category.countDocuments();
  const productsShortageCount = (await Product.find({ stock: { $lt: 10 } }))
    .length;
  const productsAvgRating = await Product.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$ratingsAvg" },
      },
    },
  ]);
  const averageRating =
    productsAvgRating.length > 0 ? productsAvgRating[0].averageRating : 0;
  res.status(200).render("./dashboard/index", {
    productsCount,
    categoriesCount,
    productsShortageCount,
    averageRating,
  });
};

const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).render("./dashboard/inventory/categories", {
    categories,
  });
};

const getCategoriesAdd = (req, res) => {
  res.status(200).render("./dashboard/inventory/add-category");
};
const getCategoriesEdit = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  res.status(200).render("./dashboard/inventory/edit-category", {
    category,
  });
};

const getProducts = async (req, res) => {
  const categories = await Category.find();
  console.log("Categories", categories);
  const products = await Product.find({ category: categories[0]?._id });
  console.log("Products", products);
  res.status(200).render("./dashboard/inventory/products", {
    categories,
    products,
  });
};

const getProductsAdd = async (req, res) => {
  const categories = await Category.find();
  res.status(200).render("./dashboard/inventory/add-product", {
    categories,
  });
};

const getProductsEdit = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const categories = await Category.find();
  res.status(200).render("./dashboard/inventory/edit-product", {
    product,
    categories,
  });
};

module.exports = {
  getDashboard,
  getCategories,
  getCategoriesAdd,
  getCategoriesEdit,
  getProducts,
  getProductsAdd,
  getProductsEdit,
};
