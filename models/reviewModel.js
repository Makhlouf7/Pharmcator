const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    review: {
      type: String,
      required: [true, "Please provide a review"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // Adds an id attribute equals the _id attribute and allow the virtual attribute "attribute that is not stored in the database, Its calculated using other values" to be sent in JSON Or as Object when a request is exist
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
// Static methods =====

// Calculating ratings average and how many reviews for the passed product
reviewSchema.statics.calcAvgReviewRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRatings: { $sum: 1 },
        avgRatings: { $avg: "$rating" },
      },
    },
  ]);
  // Avoid circular dependency
  const Product = require("./productsModel");
  // Update the passed product with calculated number of ratings and average
  await Product.findByIdAndUpdate(productId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRatings : 0,
    ratingsAvg: stats.length > 0 ? stats[0].avgRatings : 0,
  });
};

// Documents Middlewares =====
reviewSchema.post("save", async function () {
  this.constructor.calcAvgReviewRating(this.product);
});

// Queries Middlewares =====
reviewSchema.post(/^findOneAnd/, async function (doc) {
  // doc will be null if no document was found
  if (doc) await doc.constructor.calcAvgReviewRating(doc.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
