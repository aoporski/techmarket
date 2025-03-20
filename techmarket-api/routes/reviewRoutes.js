const express = require("express");
const {
  getAllReviews,
  getReviewById,
  addNewReview,
  changeReview,
  deleteReview,
  getReviewsForProduct, 
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/", addNewReview);
router.put("/:id", changeReview);
router.delete("/:id", deleteReview);
router.get("/product/:productId", getReviewsForProduct);

module.exports = router;
