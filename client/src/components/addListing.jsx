import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/header";
import "./addListing.css";

function AddListing() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    product_category: "",
    global_brand: "",
    description: "",
    country_of_origin: "India",
    country_of_operation: "",
    positioning: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const navigate = useNavigate();

  // Fetch user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log("Logged-in user:", userData);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Fetch all listings if user is admin
  useEffect(() => {
    if (!user) return;

    console.log("User role:", user.role);

    const fetchListings = async () => {
      if (user.role === "admin" || user.role === "superadmin") {
        const { data, error } = await supabase
          .from("pending_brand")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) console.error("Error fetching listings:", error);
        else {
          setAllListings(data);
          console.log("Fetched listings:", data);
        }
      }
    };

    fetchListings();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!user?.id || !user?.email) {
      navigate("/auth");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      Website: formData.website.trim(),
      product_category: formData.product_category.trim(),
      global_brand: formData.global_brand.trim(),
      description: formData.description.trim(),
      country_of_origin: formData.country_of_origin.trim(),
      country_of_operation: formData.country_of_operation.trim(),
      positioning: formData.positioning.trim(),
      approved: false,
      created_by: user.id,
    };

    if (!payload.name || !payload.product_category || !payload.description || !payload.positioning) {
      setMessage("⚠️ Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("pending_brand").insert([payload]);
      if (error) {
        console.error("Insert error:", error.message);
        setMessage("❌ Failed to submit listing. Please try again.");
      } else {
        setMessage("✅ Listing going for approval! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("❌ Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE FUNCTION FOR ADMIN
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    const { error } = await supabase.from("pending_brand").delete().eq("id", id);

    if (error) {
      alert("❌ Failed to delete listing.");
      console.error("Delete error:", error);
    } else {
      setAllListings(allListings.filter((listing) => listing.id !== id));
      alert("✅ Listing deleted successfully!");
    }
  };

  // Show authentication screen if not logged in
  if (!user) {
    return (
      <>
        <Header />
        <div className="add-form-container">
          <div className="add-form-card">
            <h1 className="add-form-title">🔐 Authentication Required</h1>
            <p className="add-form-subtitle">Please login to submit a listing.</p>
            <div className="auth-options">
              <button className="submit-button" onClick={() => navigate("/auth")}>🔐 Login</button>
              <button className="submit-button" onClick={() => navigate("/signup")}>✨ Sign Up</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="add-form-container">
        <div className="add-form-card">
          <h1 className="add-form-title">➕ Add New Indian Brand</h1>
          <p className="add-form-subtitle">
            Help us grow the MakeInIndia community by listing an Indian brand.
          </p>

          {/* Listing Form */}
          <form onSubmit={handleSubmit} className="listing-form">
            {/* Brand Information */}
            <div className="form-section">
              <h3 className="form-section-title">🏢 Brand Information</h3>
              <div className="form-group">
                <label className="form-label required-field">🏷️ Brand Name</label>
                <input
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., TATA, BoAt"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">🌐 Website</label>
                <input
                  className="form-input"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  disabled={isLoading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required-field">📦 Product Category</label>
                  <input
                    className="form-input"
                    name="product_category"
                    value={formData.product_category}
                    onChange={handleChange}
                    placeholder="Electronics, Apparel..."
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🌍 Alternative to (Global Brand)</label>
                  <input
                    className="form-input"
                    name="global_brand"
                    value={formData.global_brand}
                    onChange={handleChange}
                    placeholder="e.g., Samsung"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Description & Positioning */}
            <div className="form-section">
              <h3 className="form-section-title">📝 Description & Positioning</h3>
              <div className="form-group">
                <label className="form-label required-field">💡 Why is this a good alternative?</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Unique features, affordability, quality..."
                  required
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required-field">🎯 Market Positioning</label>
                  <select
                    className="form-select"
                    name="positioning"
                    value={formData.positioning}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select</option>
                    <option value="Premium">Premium</option>
                    <option value="Comparable">Comparable</option>
                    <option value="Mass-market">Mass-market</option>
                    <option value="Budget-friendly">Budget-friendly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">🌍 Country of Operations</label>
                  <input
                    className="form-input"
                    name="country_of_operation"
                    value={formData.country_of_operation}
                    onChange={handleChange}
                    placeholder="India, Global..."
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Country of Origin */}
            <div className="form-section">
              <h3 className="form-section-title">🇮🇳 Origin Info</h3>
              <div className="form-group">
                <label className="form-label required-field">🏛️ Country of Origin</label>
                <select
                  className="form-select"
                  name="country_of_origin"
                  value={formData.country_of_origin}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="Other">🌍 Other</option>
                </select>
              </div>
            </div>

            {message && (
              <div className={`form-message ${message.includes("✅") ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? <>Submitting...</> : <>✨ Submit Brand Listing</>}
            </button>
          </form>
          {/* Admin Listings with Delete */}
          {(user?.role === "admin" || user?.role === "superadmin") && allListings.length > 0 && (
            <div className="admin-listings">
              <h2>🛠️ Manage Listings</h2>
              {allListings.map((listing) => (
                <div key={listing.id} className="listing-card">
                  <h3>{listing.name}</h3>
                  <p>Category: {listing.product_category}</p>
                  <p>Global Brand Alternative: {listing.global_brand || "N/A"}</p>
                  <p>{listing.description}</p>
                  <p>Positioning: {listing.positioning}</p>
                  <p>Country of origin: {listing.country_of_origin}</p>
                  <button
                    onClick={() => handleDelete(listing.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddListing;