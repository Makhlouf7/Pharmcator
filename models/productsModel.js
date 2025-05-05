const Category = require("./categoriesModel");
const Review = require("./reviewModel");
const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Product must belong to category"],
  },
  image: {
    type: String,
    trim: true,
    required: [true, "Please provide product image"],
  },
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Please provide product name"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please provide product description"],
  },
  btnText: {
    type: String,
    trim: true,
    required: [true, "Please provide button text"],
  },
  stock: {
    type: Number,
    trim: true,
    required: [true, "Please provide the quantity of the product"],
  },
  ratingsAvg: {
    type: Number,
    default: null,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Queries Middlewares
productsSchema.pre("findOneAndDelete", async function (next) {
  const productId = this.getQuery()._id;
  await Review.deleteMany({ product: productId });
});

productsSchema.post("save", async function (doc) {
  const categoryId = doc.category;
  await Category.findByIdAndUpdate(categoryId, {
    $inc: { noOfProducts: 1 },
  });
});

productsSchema.post("findOneAndDelete", async function (doc) {
  const categoryId = doc.category;
  await Category.findByIdAndUpdate(categoryId, {
    $inc: { noOfProducts: -1 },
  });
});

const Product = mongoose.model("Product", productsSchema);
module.exports = Product;
