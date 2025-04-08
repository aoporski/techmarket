const Review = require("../models/reviewSchema");
const mongoose = require("mongoose");
const { Types } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

exports.addNewReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewById = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  const { ObjectId } = Types;

  try {
    const review = await Review.find({
      product_id: new ObjectId(productId),
    });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  try {
    const reviews = await Review.find({
      product_id: new Types.ObjectId(productId),
    })
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await Review.countDocuments({ productId });

    res.json({
      reviews,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewStats = async (req, res) => {
  const { productId } = req.params;

  try {
    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const stats = await Review.aggregate([
      {
        $match: {
          product_id: new Types.ObjectId.createFromHexString(productId),
        },
      }, // Corrected field and ObjectId
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = stats.reduce((sum, r) => sum + r.count, 0);
    const average =
      stats.reduce((sum, r) => sum + r._id * r.count, 0) / (total || 1);

    res.json({ averageRating: average.toFixed(2), ratingDistribution: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchReviews = async (req, res) => {
  const {
    q, // tekst
    rating,
    verified,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
  }

  if (verified === "true" || verified === "false") {
    filter.verifiedPurchase = verified === "true";
  }
  if (
    rating &&
    !Number.isNaN(Number(rating)) &&
    Number(rating) >= 0 &&
    Number(rating) <= 5
  ) {
    filter.rating = Number(rating);
  }

  if (verified?.toLowerCase() === "true") {
    filter.verifiedPurchase = true;
  } else if (verified?.toLowerCase() === "false") {
    filter.verifiedPurchase = false;
  }
  try {
    const reviews = await Review.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      results: reviews,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.voteHelpful = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({
      message: "Vote counted",
      updatedHelpfulVotes: review.likes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
