import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li>Footwear</li>
            <li>Electronics</li>
            <li>Apparel</li>
            <li>Finance</li>
            <li>Consulting</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li>How it Works</li>
            <li>Suggest a Brand</li>
            <li>Alternatives Explained</li>
            <li>Guides</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div className="footer-column">
            <h4>For Contributors</h4>
            <ul>
                <li><a href="/" className="footer-link">Home</a></li>
                <li><a href="/add" className="footer-link">Add a Listing</a></li>
                <li>Join as Reviewer</li>
                <li>Events</li>
            </ul>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin-in"></i>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>🇮🇳 MadeInIndia • Empowering Indian Brands</p>
        <div className="footer-meta">
          <span>🌐 English</span>
          <span>₹ INR</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;