const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Submit a new review
exports.submitReview = async (req, res) => {
  const { brandId, rating, comment } = req.body;
  const user = req.user;

  try {
    const { data, error } = await supabase.from("reviews").insert([
      {
        brand_id: brandId,
        user_id: user.id,
        user_name: user.name,
        rating,
        comment,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Review submitted", review: data[0] });
  } catch (err) {
    console.error("❌ Review Error:", err.message);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

// ✅ Get all reviews for a brand
exports.getReviews = async (req, res) => {
  const { brandId } = req.params;

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("❌ Fetch Review Error:", err.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Delete review (only by owner)
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const user = req.user;

  try {
    // Fetch review to verify ownership
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (fetchError || !review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user_id !== user.id) {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    const { error: deleteError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (deleteError) throw deleteError;

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Review Error:", err.message);
    res.status(500).json({ error: "Failed to delete review" });
  }
};