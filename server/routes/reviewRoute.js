const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/reviewController");
const protect = require("../middleware/auth");


// POST a review (submitReview handles all logic)
router.post("/", protect, reviewCtrl.submitReview);

// GET all reviews for a brand
router.get("/:brandId", reviewCtrl.getReviews);

router.delete("/:reviewId", protect, reviewCtrl.deleteReview);

module.exports = router;