const Review = require("../models/reviewModel");
const {
  createOne,
  updateOne,
  deleteOne,
  getOneById,
  getAll,
} = require("./handlerFactory");

// Middlewares =====

// Set User Id on the req.body
const setUserId = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

const getAllReviews = getAll(Review);
const getReview = getOneById(Review);
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

module.exports = {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setUserId,
  getReview,
};
