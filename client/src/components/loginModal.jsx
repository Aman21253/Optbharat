import React, { useState } from "react";
import "./loginModal.css";

const LoginModal = ({ close }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          close();
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.error || "❌ Login failed. Please check your credentials.");
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal" onClick={close}>
      <div className="login-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close} aria-label="Close modal">
          ✕
        </button>
        
        <h2>🔐 Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Signing In...
              </>
            ) : (
              "🔐 Sign In"
            )}
          </button>
        </form>
        
        {message && (
          <p className={message.includes("✅") ? "success" : "error"}>
            {message}
          </p>
        )}
        
        <div style={{ 
          marginTop: '1rem', 
          textAlign: 'center', 
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          Don't have an account?{" "}
          <a 
            href="/auth" 
            style={{ 
              color: 'var(--primary-color)', 
              textDecoration: 'none',
              fontWeight: '600'
            }}
            onClick={(e) => {
              e.preventDefault();
              close();
              window.location.href = '/auth';
            }}
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;