import React, { useEffect, useState } from "react";
import "./brandDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const isAdmin = role === "admin" || role === "superadmin";

  // Fetch logged-in user
  useEffect(() => {
    const getSessionUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;

      if (sessionUser) {
        setUser(sessionUser);
        if (sessionUser?.user_metadata?.role) {
          setRole(sessionUser.user_metadata.role);
        }
      } else {
        const raw = localStorage.getItem("user");
        if (raw) {
          try {
            const stored = JSON.parse(raw);
            setUser(stored);
            if (stored?.role) setRole(stored.role);
          } catch (e) {
            console.warn("Failed to parse user from localStorage:", e);
            localStorage.removeItem("user");
          }
        }
      }
    };
    getSessionUser();
  }, []);

  // Fetch brand + reviews
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

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      brand_id: Number(id), // ✅ make sure it's numeric
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
      console.error("Review insert error:", error);
      alert("❌ Failed to submit review.");
    } else {
      setReviews([data, ...reviews]);
      setComment("");
      setRating(5);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId, reviewUserId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    let query = supabase.from("reviews").delete().eq("id", reviewId);

    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { error } = await query;
    if (error) {
      console.error("Review delete error:", error);
      alert("❌ Failed to delete review.");
    } else {
      setReviews(reviews.filter((r) => r.id !== reviewId));
      alert("✅ Review deleted successfully!");
    }
  };

  // Delete brand
  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    const { error } = await supabase.from("brands").delete().eq("id", brandId);

    if (error) {
      console.error("Brand delete error:", error);
      alert("❌ Failed to delete brand.");
    } else {
      alert("✅ Brand deleted successfully!");
      navigate("/"); // redirect after deletion
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

        {isAdmin && (
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            onClick={() => handleDeleteBrand(brand.id)}
          >
            Delete Brand
          </button>
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

              {(user?.id === review.user_id || isAdmin) && (
                <button
                  onClick={() => handleDeleteReview(review.id, review.user_id)}
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