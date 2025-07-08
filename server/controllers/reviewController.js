const Review = require("../models/review");
const User = require("../models/User");

exports.submitReview = async (req, res) => {
  const { brandId, rating, comment } = req.body;

  try {
    const user = req.user; // Comes from protect middleware

    const review = await Review.create({
      brandId,
      userId: user._id,
      userName: user.name,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ brandId: req.params.brandId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// controllers/reviewController.js
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // 🔐 Check if the logged-in user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    await review.deleteOne(); // or review.remove();

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Review Error:", err);
    res.status(500).json({ error: "Server error while deleting review" });
  }
};