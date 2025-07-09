import React, { useEffect, useState, memo } from "react";
import "./Home.css";
import foreignBrandDetails from "./foreigndata";
import Header from "./components/header";
import LoginModal from "./components/loginModal";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

// --- BrandCard Component ---
const BrandCard = memo(({ brand, isBookmarked, onBookmark, onViewAlternatives }) => (
  <div
    className={`brand-card ${brand.countryOfOrigin === "India" ? "highlight" : ""}`}
    style={{ cursor: "pointer" }}
    role="button"
    tabIndex={0}
    aria-label={`Brand card for ${brand.name}`}
  >
    <button
      className="bookmark-btn"
      onClick={(e) => {
        e.stopPropagation();
        onBookmark(brand._id);
      }}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
    <div
      onClick={() => window.location.href = `/brands/${brand._id}`}
      style={{ cursor: "pointer" }}
    >
      <h2>{brand.name}</h2>
      <p><strong>Origin:</strong> {brand.countryOfOrigin}</p>
      <p><strong>Category:</strong> {brand.productCategory}</p>
      <p>{brand.description}</p>
      {!brand.countryOfOrigin.includes("India") && (
        <button
          className="alt-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewAlternatives(brand);
          }}
        >
          🔍 View Alternatives
        </button>
      )}
    </div>
  </div>
));

// --- BrandModal Component ---
const BrandModal = memo(({ selectedBrand, alternatives, onClose }) => (
  <div className="modal" role="dialog" aria-modal="true">
    <div className="modal-content">
      <h2>Indian Alternatives for "{selectedBrand.productCategory}"</h2>
      <button onClick={onClose} className="alt-btn" style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
        ✕ Close
      </button>
      {alternatives.length > 0 ? (
        alternatives.map((alt, idx) => (
          <div key={idx} className="comparison-table">
            <h3>Comparison with {alt.name}</h3>
            <table className="comparison">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>{selectedBrand.name}</th>
                  <th>{alt.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Product Range</td>
                  <td>{selectedBrand.productRange || "N/A"}</td>
                  <td>{alt.productRange || "N/A"}</td>
                </tr>
                <tr>
                  <td>Price Segment</td>
                  <td>{selectedBrand.priceSegment || "N/A"}</td>
                  <td>{alt.priceSegment || alt.positioning}</td>
                </tr>
                <tr>
                  <td>Unique Features</td>
                  <td>{selectedBrand.features || "N/A"}</td>
                  <td>{alt.features || alt.reason}</td>
                </tr>
                <tr>
                  <td>Website</td>
                  <td>N/A</td>
                  <td>
                    <a
                      href={alt.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {alt.website}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <h3>No Indian alternatives found</h3>
          <p>We're working on adding more Indian alternatives for this category.</p>
        </div>
      )}
    </div>
  </div>
));

function Home() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {
    user = {};
  }

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams();
        if (searchTerm) {
          query.append("name", searchTerm);
          query.append("countryOfOrigin", searchTerm);
        }
        const res = await fetch(`http://localhost:8080/api/brands?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        setError("Could not load brands. Please try again later.");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [searchTerm]);

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:8080/api/users/${user._id}/bookmarks`)
        .then((res) => res.json())
        .then((data) => {
          const ids = data.bookmarks.map(b => b._id);
          setBookmarks(ids);
        })
        .catch(() => {
          // Silently handle bookmark fetch errors
        });
    }
  }, [user]);

  const toggleBookmark = async (brandId) => {
    if (!user?._id) {
      setShowLogin(true);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/users/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, brandId }),
      });
      const data = await res.json();
      const ids = data.bookmarks.map(b => (typeof b === "string" ? b : b._id));
      setBookmarks(ids);
    } catch (err) {
      console.error("Bookmark error:", err);
    }
  };

  const handleViewAlternatives = (brand) => {
    const foreignData = foreignBrandDetails[brand.name] || {};
    setSelectedBrand({ ...brand, ...foreignData });
    fetch(`http://localhost:8080/api/brands/alternatives/${brand.productCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setAlternatives(data);
        setShowModal(true);
      })
      .catch(() => setAlternatives([]));
  };

  const indianBrandsCount = brands.filter(brand => brand.countryOfOrigin === "India").length;
  const totalBrandsCount = brands.length;

  return (
    <div className="app-container">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleLogin={() => setShowLogin(true)}
      />
      
      {showLogin && <LoginModal close={() => setShowLogin(false)} />}
      
      <div className="app-header">
        <h1>Discover Indian Brands</h1>
        <p>
          Explore and support Indian brands across various categories. 
          Find alternatives to global brands and contribute to the Make in India initiative.
        </p>
        {totalBrandsCount > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            justifyContent: 'center', 
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <span>🇮🇳 {indianBrandsCount} Indian Brands</span>
            <span>🌍 {totalBrandsCount} Total Brands</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="spinner" aria-label="Loading brands" />
      ) : error ? (
        <div className="error-message" role="alert">
          {error}
          <br />
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1rem' }}
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
        </div>
      ) : brands.length === 0 ? (
        <div className="empty-state">
          <h3>No brands found</h3>
          <p>
            {searchTerm 
              ? `No brands match "${searchTerm}". Try a different search term.`
              : "No brands are available at the moment. Please check back later."
            }
          </p>
          {searchTerm && (
            <button 
              className="btn btn-outline" 
              style={{ marginTop: '1rem' }}
              onClick={() => setSearchTerm("")}
            >
              🔍 Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="brand-grid">
          {brands.map((brand) => (
            <BrandCard
              key={brand._id}
              brand={brand}
              isBookmarked={bookmarks.includes(brand._id)}
              onBookmark={toggleBookmark}
              onViewAlternatives={handleViewAlternatives}
            />
          ))}
        </div>
      )}
      
      {showModal && selectedBrand && (
        <BrandModal
          selectedBrand={selectedBrand}
          alternatives={alternatives}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Home;