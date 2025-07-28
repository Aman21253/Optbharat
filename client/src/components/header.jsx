import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import LoginModal from "./loginModal";
import LogoutModal from "./logoutModal";
import { supabase } from "../supabaseClient";
import "./header.css";

const Header = ({ searchTerm, setSearchTerm }) => {
  const [user, setUser] = useState(null);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const { id, email, user_metadata } = data.session.user;
        setUser({ id, email, ...user_metadata });
      } else {
        setUser(null);
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
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">OptBharat</Link>
        <input
          type="text"
          className="header-search"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <nav className="nav-links">
          <Link to="/bookmarks">📚 My Bookmarks</Link>
          <Link to="/add">➕ Add Listing</Link>
          <Link to="/reason">🇮🇳 Why Indian Product</Link>
          {!user ? (
            <button onClick={() => navigate("/auth")} className="nav-link">
              <b>🔐 Login</b>
            </button>
          ) : (
            <button onClick={() => setShowLogoutModal(true)} className="logout-btn">👋 Logout</button>
          )}
        </nav>
      </header>

      {/* {showLoginModal && <LoginModal close={() => setShowLoginModal(false)} />} */}
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