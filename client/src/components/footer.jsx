import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About MakeInBharat</h3>
          <ul>
            <li>🏭 Promoting Indian Manufacturing</li>
            <li>🇮🇳 Supporting Local Businesses</li>
            <li>🌱 Sustainable Development</li>
            <li>💡 Innovation & Technology</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">🏠 Home</Link>
            </li>
            <li>
              <Link to="/suggest">💡 Suggest a Brand</Link>
            </li>
            <li>
              <Link to="/bookmarks">📚 My Bookmarks</Link>
            </li>
            <li>
              <Link to="/add">➕ Add Listing</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li>👟 Footwear & Fashion</li>
            <li>📱 Electronics & Tech</li>
            <li>💻 Computers & IT</li>
            <li>🏠 Home & Lifestyle</li>
            <li>🚗 Automotive</li>
            <li>🏥 Healthcare</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>📧 Contact Us</li>
            <li>❓ FAQ</li>
            <li>📋 Terms of Service</li>
            <li>🔒 Privacy Policy</li>
            <li>📞 Help Center</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <Link to="/" className="footer-logo">
          MakeInBharat
        </Link>
        
        <p className="footer-tagline">
          Empowering Indian Brands • Building a Self-Reliant India
        </p>

        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Contact</a>
        </div>

        <div className="footer-social">
          <a href="#" className="social-link" aria-label="Facebook">
            <FaFacebook size={22} />
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <FaTwitter size={22} />
          </a>
          <a href="#" className="social-link" aria-label="LinkedIn">
            <FaLinkedin size={22} />
          </a>
          <a href="#" className="social-link" aria-label="Instagram">
            <FaInstagram size={22} />
          </a>
        </div>

        <div className="footer-copyright">
          © {currentYear} MakeInBharat. All rights reserved. 
          Made with ❤️ for India
        </div>
      </div>
    </footer>
  );
};

export default Footer;