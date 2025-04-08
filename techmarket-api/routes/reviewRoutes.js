const express = require("express");
const {
  getAllReviews,
  getReviewById,
  addNewReview,
  changeReview,
  deleteReview,
  getReviewsForProduct,
  getReviewStats,
  searchReviews,
  voteHelpful,
} = require("../controllers/reviewControllerMongo"); //require("../controllers/reviewController");

const router = express.Router();

router.get("/", getAllReviews);
router.put("/:id", changeReview);
router.delete("/:id", deleteReview);
router.get("/product/:productId", getReviewsForProduct);
router.get("/product/:productId/stats", getReviewStats);
router.get("/search", searchReviews);
router.post("/:id/vote", voteHelpful);
router.post("/", addNewReview);
router.post("/", addNewReview);

module.exports = router;
