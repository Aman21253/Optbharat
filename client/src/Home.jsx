import React, { useEffect, useState } from "react";
import "./Home.css";
import foreignBrandDetails from "./foreigndata";
import Header from "./components/Header";
import LoginModal from "./components/loginModal";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  let user = {};
try {
  user = JSON.parse(localStorage.getItem("user")) || {};
} catch (e) {
  user = {};
}
useEffect(() => {
  const fetchBrands = async () => {
    try {
      const query = new URLSearchParams();
      if (searchTerm){ query.append("name", searchTerm);
        query.append("countryOfOrigin", searchTerm);
      }
      // add more filters later if you want
      const res = await fetch(`http://localhost:8080/api/brands?${query.toString()}`);
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
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
        });
    }
  }, [user]);

  const toggleBookmark = async (brandId) => {
    if (!user?._id) return alert("Please login");
  
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
      console.error("Bookmark failed", err);
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
      .catch((err) => console.error("Error fetching alternatives:", err));
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleLogin={() => setShowLogin(true)}
      />
      {showLogin && <LoginModal close={() => setShowLogin(false)} />}
      {loading ? (
        <p>Loading brands...</p>
      ) : (
        <div className="brand-grid">
          {brands.map((brand, index) => (
            <div
              className={`brand-card ${
                brand.countryOfOrigin === "India" ? "highlight" : ""
              }`}
              key={index}
            >
              <button
                className="bookmark-btn"
                onClick={() => toggleBookmark(brand._id)}
                title="Toggle Bookmark"
              >
                {bookmarks.includes(brand._id) ? (
                  <FaBookmark />
                ) : (
                  <FaRegBookmark />
                )}
              </button>

              <Link
                to={`/brands/${brand._id}`}
                style={{ textDecoration: "none", color: "#333" }}
              >
                <h2>{brand.name}</h2>
              </Link>
              <p><strong>Origin:</strong> {brand.countryOfOrigin}</p>
              <p><strong>Category:</strong> {brand.productCategory}</p>
              <p>{brand.description}</p>

              {!brand.countryOfOrigin.includes("India") && (
                <button
                  className="alt-btn"
                  onClick={() => handleViewAlternatives(brand)}
                >
                  View Alternatives
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && selectedBrand && (
        <div className="modal">
          <div className="modal-content">
            <h2>Indian Alternatives for "{selectedBrand.productCategory}"</h2>
            <button onClick={() => setShowModal(false)}>Close</button>

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
              <p>No Indian alternatives found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;