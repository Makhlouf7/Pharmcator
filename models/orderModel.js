const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide you full name"],
  },
  contactEmail: {
    type: String,
    required: [true, "Please provide a contact email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone"],
  },
  address: {
    type: String,
    required: [true, "Please provide your address"],
  },
  city: {
    type: String,
    required: [true, "Please provide your city"],
  },
  image: String,

  cartItems: [
    {
      quantity: Number,
      price: Number,
      productName: String,
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
