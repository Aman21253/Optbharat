import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "./logoutModal";
import "./header.css";

const Header = ({ searchTerm, setSearchTerm }) => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for user on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Logout handler
  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowLogoutModal(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          MakeInBharat
        </Link>

        <input
          type="text"
          className="header-search"
          placeholder="🔍 Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/bookmarks" className="nav-link" onClick={closeMobileMenu}>
            📚 My Bookmarks
          </Link>
          <Link to="/add" className="nav-link" onClick={closeMobileMenu}>
            ➕ Add Listing
          </Link>
          {user?.role === "admin" || user?.role === "superadmin" ? (
            <Link to="/admin/brands" className="nav-link" onClick={closeMobileMenu}>
              ⚙️ Admin Panel
            </Link>
          ) : null}

          {!user ? (
            <Link to="/auth" className="nav-link" onClick={closeMobileMenu}>
              🔐 Login
            </Link>
          ) : (
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="logout-btn"
            >
              👋 Logout
            </button>
          )}
        </nav>
      </header>
      
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