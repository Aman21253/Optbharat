import React, { useEffect, useState } from "react";
import "./brandDetail.css";
import { useParams } from "react-router-dom";

function BrandDetail() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandRes = await fetch(`http://localhost:8080/api/brands/${id}`);
        const brandData = await brandRes.json();
        setBrand(brandData);

        if (!token) {
          console.warn("⚠️ No token found. Skipping review fetch.");
          setReviews([]);
          return;
        }

        const reviewRes = await fetch(`http://localhost:8080/api/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reviewRes.ok) {
          console.error("❌ Review fetch failed with status", reviewRes.status);
          setReviews([]);
        } else {
          const reviewData = await reviewRes.json();
          setReviews(Array.isArray(reviewData) ? reviewData : []);
        }
      } catch (err) {
        console.error("Error fetching brand or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brandId: id,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setRating(5);
        setComment("");
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      alert("Server error submitting review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
  
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
      } else {
        alert(data.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error deleting review");
    }
  };

  if (loading) return <div className="spinner" aria-label="Loading brand details" />;

  return (
    <div className="brand-page">
      <div className="brand-card">
        <h2>{brand.name}</h2>
        <p><strong>Country of Origin:</strong> {brand.countryOfOrigin || "N/A"}</p>
        <p><strong>Country of Operation:</strong> {brand.countryOfOperation || "N/A"}</p>
        <p><strong>Category:</strong> {brand.productCategory || "N/A"}</p>
        <p><strong>Description:</strong> {brand.description || "N/A"}</p>
        {brand.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a href={brand.website} target="_blank" rel="noreferrer">
              {brand.website}
            </a>
          </p>
        )}
      </div>

      <div className="review-form-card">
        <h3>Submit a Review</h3>
        {token ? (
          <form onSubmit={handleSubmitReview}>
            <label>
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your feedback..."
              rows={4}
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        ) : (
          <p>Please login to write a review.</p>
        )}
      </div>

      <div className="reviews-section">
        <h3>All Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <p>
                <strong>{review.userName || "Anonymous"}</strong> ⭐{" "}
                {review.rating}/5
              </p>
              <p>{review.comment}</p>
              <small>{new Date(review.createdAt).toLocaleString()}</small>

              {user?._id === review.userId && (
          <button
            onClick={() => handleDeleteReview(review._id)}
            style={{ marginTop: "5px", background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
          >
            Delete
          </button>
        )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BrandDetail;