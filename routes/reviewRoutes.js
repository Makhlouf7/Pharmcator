const express = require("express");
const router = express.Router();
const { isUserLoggedIn } = require("../controllers/authController");
const {
  createReview,
  getAllReviews,
  updateReview,
  getReview,
  deleteReview,
  setUserId,
} = require("../controllers/reviewController");

router.use(isUserLoggedIn);
router.route("/").post(setUserId, createReview).get(getAllReviews);
router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
