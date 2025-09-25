import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "./logoutModal";
import logo from "../assets/Logo_OB.png";
import { supabase } from "../supabaseClient";
import "./header.css";

const Header = ({ searchTerm, setSearchTerm }) => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const { id, email, user_metadata } = data.session.user;
        setUser({ id, email, ...user_metadata });
        // console.log(`[HEADER] user loaded -> role=${user_metadata?.role || "user"}`);
      } else {
        setUser(null);
        console.log("[HEADER] no user");
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        setUser({ id, email, ...user_metadata });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogoutConfirm = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowLogoutModal(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="logo-button-container">
          <div className="logo-and-why">
            {/* Logo and text on the same line */}
            <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logo} alt="OptBharat Logo" className="logo-img" />
              OPTBHARAT
            </Link>

            {/* Button below logo */}
          </div>
          <Link to="/reason" className="why-btn" onClick={() => setIsMobileMenuOpen(false)}>
              🇮🇳 Why Indian Product
            </Link>

          {/* Desktop-only nav links */}
          <nav className="nav-links desktop-only">
            <Link to="/bookmarks">📚 My Bookmarks</Link>
            <Link to="/add">➕ Add Listing</Link>
            <Link to="/reason">🇮🇳 Why Indian Product</Link>
            {user?.role === "admin" || user?.user_metadata?.role === "admin" ? (
              <div className="admin-dropdown">
                <span className="admin-label">🛠️ Admin ▾</span>
                <div className="admin-menu">
                  <Link to="/admin/pending">Pending Listings</Link>
                  <Link to="/admin/suggestions">Brand Suggestions</Link>
                  <Link to="/admin/brands">Unapproved Brands</Link>
                </div>
              </div>
            ) : null}

            {!user ? (
              <button onClick={() => navigate("/auth")} className="nav-link">
                🔐 Login
              </button>
            ) : (
              <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
                👋 Logout
              </button>
            )}
          </nav>
        </div>

        {/* Search bar */}
        <input
          type="text"
          className="header-search"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn mobile-only"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile nav links */}
        <nav className={`nav-links mobile-only ${isMobileMenuOpen ? "active" : ""}`}>
          <Link to="/bookmarks" onClick={() => setIsMobileMenuOpen(false)}>📚 My Bookmarks</Link>
          <Link to="/add" onClick={() => setIsMobileMenuOpen(false)}>➕ Add Listing</Link>
          <Link to="/reason" onClick={() => setIsMobileMenuOpen(false)}>🇮🇳 Why Indian Product</Link>
          {user?.role === "admin" || user?.role === "superadmin" || user?.user_metadata?.role === "admin" || user?.user_metadata?.role === "superadmin" ? (
            <div className="admin-dropdown">
              <span className="admin-label">🛠️ Admin ▾</span>
              <div className="admin-menu">
                <Link to="/admin/pending" onClick={() => setIsMobileMenuOpen(false)}>Pending Listings</Link>
                <Link to="/admin/suggestions" onClick={() => setIsMobileMenuOpen(false)}>Brand Suggestions</Link>
                <Link to="/admin/brands" onClick={() => setIsMobileMenuOpen(false)}>Unapproved Brands</Link>
              </div>
            </div>
          ) : null}

          {!user ? (
            <button onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }} className="nav-link">
              🔐 Login
            </button>
          ) : (
            <button onClick={() => { setShowLogoutModal(true); setIsMobileMenuOpen(false); }} className="logout-btn">
              👋 Logout
            </button>
          )}
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </>
  );
};

export default Header;