const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true,
    required: [true, "Please provide category image"],
  },
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide category name"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please provide category description"],
  },
  btnText: {
    type: String,
    trim: true,
    required: [true, "Please provide the button text"],
  },
  noOfProducts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
