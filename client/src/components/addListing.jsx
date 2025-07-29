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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!user?.id || !user?.email) {
      // setMessage("❌ Please login to submit a listing.");
      // setIsLoading(false);
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
        setMessage("✅ Listing going for approval ! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("❌ Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // const activateDevMode = () => {
  //   const devUser = { id: 'dev', name: 'Developer', email: 'dev@test.com' };
  //   localStorage.setItem("user", JSON.stringify(devUser));
  //   localStorage.setItem("token", "dev-token");
  //   setUser(devUser);
  //   console.log("✅ Dev mode activated:", devUser);
  // };

  if (!user) {
    return (
      <>
      <Header/>
      <div className="add-form-container">
        <div className="add-form-card">
          <h1 className="add-form-title">🔐 Authentication Required</h1>
          <p className="add-form-subtitle">
            Please login or use Dev Mode to test form submission.
          </p>

          <div className="auth-options">
            <button className="submit-button" onClick={() => window.location.href = "/auth"}>
              🔐 Login
            </button>
            <button className="submit-button" onClick={() => window.location.href = "/signup"}>
              ✨ Sign Up
            </button>
            {/* <button className="submit-button secondary" onClick={activateDevMode}>
              🛠️ Dev Mode (Bypass Auth)
            </button> */}
          </div>

          <div className="debug-info">
            <h3>Debug Info</h3>
            <p>User: {localStorage.getItem("user") || "None"}</p>
            {/* <p>Token: {localStorage.getItem("token") || "None"}</p> */}
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="add-form-container">
      <div className="add-form-card">
        <h1 className="add-form-title">➕ Add New Indian Brand</h1>
        <p className="add-form-subtitle">
          Help us grow the MakeInIndia community by listing an Indian brand.
        </p>

        <form onSubmit={handleSubmit} className="listing-form">
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
            {isLoading ? (
              <>
                <div className="loading-spinner" /> Submitting...
              </>
            ) : (
              <>✨ Submit Brand Listing</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddListing;