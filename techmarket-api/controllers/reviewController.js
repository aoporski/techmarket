const { get } = require("lodash");
const Review = require("../models/reviewModel");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Błąd pobierania recenzji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.getReviewById(id);

    if (!review) {
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    }

    res.json(review);
  } catch (error) {
    console.error("Błąd pobierania recenzji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const addNewReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating) {
      return res.status(400).json({ message: "Brakuje wymaganych pól" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Ocena musi być między 1 a 5" });
    }

    const newReview = await Review.addNewReview({ productId, userId, rating, comment });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Błąd dodawania recenzji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const changeReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({ message: "Ocena musi być między 1 a 5" });
    }

    const updated = await Review.changeReview(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Błąd aktualizacji recenzji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.deleteReview(id);

    if (!deleted) {
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    }

    res.json({ message: "Recenzja usunięta", deleted });
  } catch (error) {
    console.error("Błąd usuwania recenzji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


const getReviewsForProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.getReviewsForProduct(productId);
        res.json(reviews);
    } catch (error) {
        console.error("Błąd pobierania recenzji dla produktu:", error);
        res.status(500).json({ message: "Błąd serwera" });      
    }
}



module.exports = {
  getAllReviews,
  getReviewById,
  addNewReview,
  changeReview,
  deleteReview,
  getReviewsForProduct,
};
