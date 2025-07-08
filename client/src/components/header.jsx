import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "./logoutModal";
import "./Header.css";

const Header = ({ searchTerm, setSearchTerm }) => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    navigate("/");
  };

  return (
    <>
    <header className="header">
      <Link to="/" className="logo">
        🇮🇳 MakeInBharat
      </Link>

      <input
        type="text"
        className="header-search"
        placeholder="Search brands..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <nav className="nav-links">
        <Link to="/bookmarks" className="nav-link">My Bookmarks</Link>
        <Link to="/add">Add Listing</Link>
          {user?.role === "admin" || user?.role === "superadmin" ? (
          <Link to="/admin/brands">Admin Panel</Link>
        ) : null}


        {!user ? (
          <>
            <Link to="/auth">Login</Link>
          </>
        ) : (
          <>
            {/* <span> {user.name || "User"}</span> */}
            <Link onClick={() => setShowLogoutModal(true)} className="logout-btn">Logout</Link>
          </>
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