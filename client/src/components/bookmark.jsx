import React, { useEffect, useState } from "react";
import "./Bookmarks.css";
import { Link } from "react-router-dom";

function Bookmarks() {
  const [bookmarkedBrands, setBookmarkedBrands] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:8080/api/users/${user._id}/bookmarks`)
        .then((res) => res.json())
        .then((data) => setBookmarkedBrands(data.bookmarks))
        .catch((err) => console.error("Error loading bookmarks", err));
    }
  }, []);

  if (!user?._id) {
    return (
      <div className="bookmark-container">
        <p className="bookmark-message">Please login to view your bookmarks.</p>
      </div>
    );
  }

  return (
    <div className="bookmark-container">
  <h2 className="bookmark-heading">My Bookmarked Brands</h2>
  {bookmarkedBrands.length === 0 ? (
    <p className="bookmark-message">No bookmarks yet.</p>
  ) : (
    <div className="brand-grid">
      {bookmarkedBrands.map((brand) => (
        <div className={`brand-card ${brand.countryOfOrigin === "India" ? "highlight" : ""}`} key={brand._id}>
          <Link to={`/brands/${brand._id}`} className="brand-link">
            <h3>{brand.name}</h3>
          </Link>
          <p><strong>Category:</strong> {brand.productCategory}</p>
          <p><strong>Origin:</strong> {brand.countryOfOrigin}</p>
          <p>{brand.description}</p>
        </div>
      ))}
    </div>
  )}
</div>
  );
}

export default Bookmarks;