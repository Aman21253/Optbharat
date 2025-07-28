import React, { useEffect, useState, memo } from "react";
import "./Home.css";
import foreignBrandDetails from "./foreigndata";
import Header from "./components/header";
import LoginModal from "./components/loginModal";
import { supabase } from "./supabaseClient";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

// BrandCard component
const BrandCard = memo(({ brand, isBookmarked, onBookmark, onViewAlternatives }) => (
  <div
    className={`brand-card ${brand.country_of_origin === "India" ? "highlight" : ""}`}
    role="button"
  >
    <button
      className="bookmark-btn"
      onClick={(e) => {
        e.stopPropagation();
        onBookmark(brand.id);
      }}
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>

    <div onClick={() => window.location.href = `/brands/${brand.id}`}>
      <h2>{brand.name}</h2>
      <p><strong>Origin:</strong> {brand.country_of_origin}</p>
      <p><strong>Category:</strong> {brand.product_category}</p>
      <p>{brand.description}</p>

      {brand.country_of_origin !== "India" && (
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

// Modal for alternatives
const BrandModal = memo(({ selectedBrand, alternatives, onClose }) => (
  <div className="modal" role="dialog">
    <div className="modal-content">
      <h2>Indian Alternatives for "{selectedBrand.product_category}"</h2>
      <button onClick={onClose} className="alt-btn" style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }}>
        ✕ Close
      </button>
      {alternatives.length > 0 ? (
        alternatives.map((alt, idx) => (
          <div key={idx} className="comparison-table">
            <h3>Comparison with {alt.name}</h3>
            <table className="comparison">
              <tbody>
                <tr>
                  <td>Country of origin </td>
                  <td>{selectedBrand.country_of_origin || "N/A"}</td>
                  <td>{alt.country_of_origin || "N/A"}</td>
                </tr>
                <tr>
                  <td>Product category</td>
                  <td>{selectedBrand.productRange || "N/A"}</td>
                  <td>{alt.positioning || "N/A"}</td>
                </tr>
                <tr>
                  <td>Unique Features</td>
                  <td>{selectedBrand.features || "N/A"}</td>
                  <td>{alt.description || "N/A"}</td>
                </tr>
                <tr>
                  <td>Website</td>
                  <td>
                    {selectedBrand.website ? (
                      <a href={selectedBrand.website} target="_blank" rel="noopener noreferrer">{selectedBrand.website}</a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {alt.Website ? (
                      <a href={alt.Website} target="_blank" rel="noopener noreferrer">{alt.Website}</a>
                    ) : (
                      "N/A"
                    )}
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

  let user = null;
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        user = JSON.parse(rawUser);
      }
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
    }

  // Fetch brands from Supabase
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        let query = supabase.from("brands").select("*").eq("approved", true);
    
        if (searchTerm) {
          query = query.or(
            `name.ilike.*${searchTerm}*,country_of_origin.ilike.*${searchTerm}*,product_category.ilike.*${searchTerm}*`
          );
        }
    
        const { data, error } = await query;
        if (error) throw error;
        // Deduplicate using brand `id`
        const seen = new Set();
        const uniqueBrands = (data || []).filter((brand) => {
          const key = brand.name.trim().toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Error fetching brands:", err.message);
        setError("❌ Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [searchTerm]);

  // Fetch bookmarks from Supabase
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("bookmark")
          .select("brand_id")
          .eq("user_id", user.id);

        if (error) throw error;

        const ids = data.map((item) => item.brand_id);
        setBookmarks(ids);
      } catch (err) {
        console.error("❌ Error fetching bookmarks:", err.message);
      }
    };

    fetchBookmarks();
  }, [user]);

  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      localStorage.removeItem("user");
    }
  };

  getUser();
}, []);

  // Toggle bookmark
  const toggleBookmark = async (brandId) => {
    if (!user?.id) return setShowLogin(true);

    try {
      const isBookmarked = bookmarks.includes(brandId);

      if (isBookmarked) {
        await supabase
          .from("bookmark")
          .delete()
          .eq("user_id", user.id)
          .eq("brand_id", brandId);
      } else {
        await supabase
          .from("bookmark")
          .insert([{ user_id: user.id, brand_id: brandId }]);
      }

      // Refresh
      const { data } = await supabase
        .from("bookmark")
        .select("brand_id")
        .eq("user_id", user.id);

      setBookmarks(data.map((b) => b.brand_id));
    } catch (err) {
      console.error("Bookmark toggle failed:", err.message);
    }
  };

  // View Indian alternatives
  const handleViewAlternatives = async (brand) => {
    const foreignData = foreignBrandDetails[brand.name] || {};
    setSelectedBrand({ ...brand, ...foreignData });

    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("product_category", brand.product_category)
      .eq("country_of_origin", "India");

    if (!error) {
      setAlternatives(data || []);
      setShowModal(true);
    } else {
      setAlternatives([]);
    }
  };

  const indianBrandsCount = brands.filter(b => b.country_of_origin === "India").length;

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
        <p>Explore & support Indian alternatives to global brands</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <span>🇮🇳 {indianBrandsCount} Indian Brands</span>
          <span>🌍 {brands.length} Total Brands</span>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <div className="error-message">
          {error}
          <br />
          <button onClick={() => window.location.reload()}>🔄 Try Again</button>
        </div>
      ) : brands.length === 0 ? (
        <div className="empty-state">
          <h3>No brands found</h3>
        </div>
      ) : (
        <div className="brand-grid">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              isBookmarked={bookmarks.includes(brand.id)}
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