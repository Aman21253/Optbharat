import React, { useState, useEffect } from "react";

function ReviewSection({ listingId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${listingId}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setMessage("⚠️ Failed to fetch reviews.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      return setMessage("⚠️ Please write a comment.");
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/reviews/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Review submitted!");
        setComment("");
        setRating(5);
        fetchReviews(); // Refresh reviews
      } else {
        setMessage(data.error || "❌ Failed to submit review");
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1)
    : "No ratings yet";

  return (
    <div className="review-section" style={{ marginTop: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h3>⭐ Reviews & Ratings</h3>
      <p><strong>Average Rating:</strong> {averageRating} / 5</p>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="rating-select">Rating:</label>
        <select id="rating-select" value={rating} onChange={(e) => setRating(Number(e.target.value))} aria-label="Select rating">
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>
              {val} Star{val > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="review-textarea">Your Review:</label>
        <textarea
          id="review-textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          style={{ width: "100%", marginTop: "10px" }}
          aria-label="Write your review"
        />
        <br />
        <button onClick={handleSubmit} disabled={loading} style={{ marginTop: "10px" }} aria-label="Submit Review">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        {message && <p className="form-message" role="alert" style={{ marginTop: "10px" }}>{message}</p>}
      </div>

      <hr />
      <h4>{reviews.length} Review{reviews.length !== 1 ? "s" : ""}</h4>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev._id} className="review-item" style={{ marginBottom: "15px" }}>
            <strong>{rev.userName}</strong> – {rev.rating}⭐
            <p>{rev.comment}</p>
            <small style={{ color: "gray" }}>{new Date(rev.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewSection;