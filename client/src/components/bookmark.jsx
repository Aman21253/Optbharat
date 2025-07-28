import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import Header from "../components/header";
import "./Bookmarks.css";

function Bookmarks() {
  const [bookmarkedBrands, setBookmarkedBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  let user;
  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) {
        setMessage("Please log in to view bookmarks.");
        setLoading(false);
        return;
      }

      try {
        // Fetch bookmark records
        const { data: bookmarks, error: bookmarkError } = await supabase
          .from("bookmark")
          .select("brand_id")
          .eq("user_id", user.id);

        if (bookmarkError) throw new Error(bookmarkError.message);

        const brandIds = bookmarks.map(b => b.brand_id);

        if (brandIds.length === 0) {
          setBookmarkedBrands([]);
          setLoading(false);
          return;
        }

        // Fetch brand details
        const { data: brands, error: brandError } = await supabase
          .from("brands")
          .select("*")
          .in("id", brandIds)
          .eq("approved", true); // only show approved ones

        if (brandError) throw new Error(brandError.message);

        setBookmarkedBrands(brands || []);
      } catch (error) {
        console.error("❌ Error loading bookmarks:", error.message);
        setMessage("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user?.id]);

  if (!user?.id) {
    return (
      <div className="bookmark-container">
        <p className="bookmark-message">Please login to view your bookmarks.</p>
      </div>
    );
  }

  return (
    <>
      <Header/>
      <div className="bookmark-container">
        <h2 className="bookmark-heading">My Bookmarked Brands</h2>
        {loading ? (
          <p className="bookmark-message">Loading...</p>
        ) : bookmarkedBrands.length === 0 ? (
          <p className="bookmark-message">No bookmarks yet.</p>
        ) : (
          <div className="brand-grid">
            {bookmarkedBrands.map((brand) => (
              <div className={`brand-card ${brand.country_of_origin === "India" ? "highlight" : ""}`} key={brand.id}>
                <Link to={`/brands/${brand.id}`} className="brand-link">
                  <h3>{brand.name}</h3>
                </Link>
                <p><strong>Category:</strong> {brand.product_category}</p>
                <p><strong>Origin:</strong> {brand.country_of_origin}</p>
                <p>{brand.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Bookmarks;