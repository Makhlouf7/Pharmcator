const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const {
  createOne,
  updateOne,
  deleteOne,
  getOneById,
  getAllData,
} = require("./handlerFactory");

// Middlewares =====

const setTourUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

const setReviewFilter = (req, res, next) => {
  if (req.params.tourId) req.filterDataOptions = { tour: req.params.tourId };
  next();
};

const getAllReviews = getAllData(Review);

const getReview = getOneById(Review);
const createReview = createOne(Review);
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

module.exports = {
  createReview,
  setTourUserIds,
  getAllReviews,
  deleteReview,
  updateReview,
  getReview,
  setReviewFilter,
};
