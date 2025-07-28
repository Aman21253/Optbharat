import React, { useEffect, useState } from "react";
import "./brandDetail.css";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

function BrandDetail() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSessionUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    getSessionUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: brandData, error: brandError } = await supabase
          .from("brands")
          .select("*")
          .eq("id", id)
          .single();

        if (brandError) throw brandError;
        setBrand(brandData);

        const { data: reviewData, error: reviewError } = await supabase
          .from("reviews")
          .select("*")
          .eq("brand_id", id)
          .order("created_at", { ascending: false });

        if (reviewError) throw reviewError;
        setReviews(reviewData || []);
      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      brand_id: id,
      rating,
      comment,
      user_id: user.id,
      user_name: user.user_metadata?.name || user.email,
    };

    const { data, error } = await supabase
      .from("reviews")
      .insert([payload])
      .select()
      .single();

    if (error) {
      alert("❌ Failed to submit review.");
    } else {
      setReviews([data, ...reviews]);
      setComment("");
      setRating(5);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) {
      alert("❌ Failed to delete review.");
    } else {
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  if (loading) return <div className="spinner" aria-label="Loading brand details" />;

  return (
    <div className="brand-page">
      <div className="brand-card">
        <h2>{brand.name}</h2>
        <p><strong>Country of Origin:</strong> {brand.country_of_origin || "N/A"}</p>
        <p><strong>Country of Operation:</strong> {brand.country_of_operation || "N/A"}</p>
        <p><strong>Category:</strong> {brand.product_category || "N/A"}</p>
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
        {user ? (
          <form onSubmit={handleSubmitReview}>
            <label>
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}</option>
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
            <div key={review.id} className="review-card">
              <p><strong>{review.user_name}</strong> ⭐ {review.rating}/5</p>
              <p>{review.comment}</p>
              <small>{new Date(review.created_at).toLocaleString()}</small>
              {user?.id === review.user_id && (
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  style={{
                    marginTop: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
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