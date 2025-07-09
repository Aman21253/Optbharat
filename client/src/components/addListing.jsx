import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./addListing.css";

function AddListing() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    productCategory: "",
    globalBrand: "",
    description: "",
    countryOfOrigin: "India", // Default to India
    countryOfOperations: "",
    positioning: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    // Remove auto-redirect. Only set user if found.
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login to submit a listing");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      website: formData.website.trim(),
      productCategory: formData.productCategory.trim(),
      globalBrand: formData.globalBrand.trim(),
      description: formData.description.trim(),
      countryOfOrigin: formData.countryOfOrigin,
      countryOfOperations: formData.countryOfOperations.trim(),
      positioning: formData.positioning,
    };

    // Basic validation
    if (!payload.name || !payload.productCategory || !payload.description) {
      setMessage("⚠️ Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/brands", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Listing submitted successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.error || "❌ Failed to submit listing. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="add-form-container">
        <div className="add-form-card">
          <div className="add-form-header">
            <h1 className="add-form-title">🔐 Authentication Required</h1>
            <p className="add-form-subtitle">
              You need to be logged in to submit a brand listing.<br />
              <strong>For testing, you can use Dev Mode below.</strong>
            </p>
          </div>
          <div className="debug-info">
            <h3>🔍 Debug Information:</h3>
            <p>User data in localStorage: {localStorage.getItem("user") || "None"}</p>
            <p>Token in localStorage: {localStorage.getItem("token") || "None"}</p>
          </div>
          <div className="auth-options">
            <button 
              className="submit-button"
              onClick={() => window.location.href = "/auth"}
            >
              🔐 Login
            </button>
            <button 
              className="submit-button"
              onClick={() => window.location.href = "/signup"}
            >
              ✨ Sign Up
            </button>
            <button 
              className="submit-button secondary"
              onClick={() => {
                // Temporary bypass for development
                const devUser = { id: 'dev', name: 'Developer', email: 'dev@test.com' };
                setUser(devUser);
                localStorage.setItem("user", JSON.stringify(devUser));
                localStorage.setItem("token", "dev-token");
                console.log("Dev mode activated with user:", devUser);
              }}
            >
              🛠️ Dev Mode (Bypass Auth) - Click to Test Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-form-container">
      <div className="add-form-card">
        <div className="add-form-header">
          <h1 className="add-form-title">➕ Add New Indian Brand</h1>
          <p className="add-form-subtitle">
            Help us grow the MakeInBharat community by adding a new Indian brand listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="listing-form" aria-label="Add new brand listing form">
          <div className="form-section">
            <h3 className="form-section-title">🏢 Brand Information</h3>
            
            <div className="form-group">
              <label className="form-label required-field">
                🏷️ Brand Name
              </label>
              <input 
                className="form-input"
                name="name" 
                placeholder="Enter the brand name"
                value={formData.name}
                onChange={handleChange} 
                required 
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                🌐 Website
              </label>
              <input 
                className="form-input"
                name="website" 
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange} 
                disabled={isLoading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required-field">
                  📦 Product Category
                </label>
                <input 
                  className="form-input"
                  name="productCategory" 
                  placeholder="e.g., Electronics, Footwear, Apparel"
                  value={formData.productCategory}
                  onChange={handleChange} 
                  required 
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  🌍 Alternative to (Global Brand)
                </label>
                <input 
                  className="form-input"
                  name="globalBrand" 
                  placeholder="e.g., Nike, Apple, Samsung"
                  value={formData.globalBrand}
                  onChange={handleChange} 
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">📝 Description & Positioning</h3>
            
            <div className="form-group">
              <label className="form-label required-field">
                💡 Why is this a good alternative?
              </label>
              <textarea 
                className="form-textarea"
                name="description" 
                placeholder="Describe what makes this brand special, its unique features, quality, pricing, and why it's a good alternative to global brands..."
                value={formData.description}
                onChange={handleChange} 
                required 
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required-field">
                  🎯 Market Positioning
                </label>
                <select 
                  className="form-select"
                  name="positioning" 
                  value={formData.positioning}
                  onChange={handleChange} 
                  required 
                  disabled={isLoading}
                >
                  <option value="">Select positioning</option>
                  <option value="Premium">Premium - High-end, luxury segment</option>
                  <option value="Comparable">Comparable - Similar quality to global brands</option>
                  <option value="Mass-market">Mass-market - Affordable, accessible pricing</option>
                  <option value="Budget-friendly">Budget-friendly - Cost-effective alternative</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  🌍 Country of Operations
                </label>
                <input 
                  className="form-input"
                  name="countryOfOperations" 
                  placeholder="e.g., India, Global, South Asia"
                  value={formData.countryOfOperations}
                  onChange={handleChange} 
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">🇮🇳 Origin Information</h3>
            
            <div className="form-group">
              <label className="form-label required-field">
                🏛️ Country of Origin
              </label>
              <select 
                className="form-select"
                name="countryOfOrigin" 
                value={formData.countryOfOrigin}
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

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
            aria-label="Submit brand listing"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Submitting...
              </>
            ) : (
              <>
                ✨ Submit Brand Listing
              </>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>💡 Tips for a great listing:</strong>
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '1.5rem', 
            textAlign: 'left',
            lineHeight: '1.6'
          }}>
            <li>Provide detailed descriptions of unique features</li>
            <li>Include information about quality and pricing</li>
            <li>Mention any certifications or awards</li>
            <li>Explain why it's a good alternative to global brands</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddListing;