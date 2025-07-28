import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./auth.css";

function Auth() {
  const navigate = useNavigate();

  // Detect mode from URL
  const [isLogin, setIsLogin] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("signup") !== "true"; // false = show SignUp
  });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    isLogin
      ? setLoginForm((prev) => ({ ...prev, [name]: value }))
      : setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Supabase Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginForm.email,
          password: loginForm.password,
        });

        if (error) {
          setMessage("❌ " + error.message);
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.session?.access_token);
          setMessage("✅ Logged in successfully!");
          setTimeout(() => navigate("/"), 1000);
        }
      } else {
        // Supabase Signup
        const { data, error } = await supabase.auth.signUp({
          email: signupForm.email,
          password: signupForm.password,
          options: {
            data: { name: signupForm.name, role: "user" },
          },
        });

        if (error) {
          setMessage("❌ " + error.message);
        } else {
          setMessage("✅ Signup successful! Please check your email to confirm.");
        }
      }
    } catch (err) {
      setMessage("❌ Unexpected error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentForm = isLogin ? loginForm : signupForm;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">MakeInBharat</div>
          <h1 className="auth-title">
            {isLogin ? "Welcome Back" : "Join MakeInBharat"}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Sign in to continue exploring Indian brands"
              : "Create your account to support Indian brands"}
          </p>
        </div>

        <div className="auth-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            🔐 Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            ✨ Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">👤 Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={signupForm.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">📧 Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={currentForm.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={currentForm.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {message && (
            <div
              className={
                message.includes("✅") ? "success-message" : "error-message"
              }
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              <>
                {isLogin ? "🔐 Sign In" : "✨ Create Account"}
              </>
            )}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <a
                href="/auth?signup=true"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(false);
                  setMessage("");
                }}
              >
                Sign up here
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a
                href="/auth"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(true);
                  setMessage("");
                }}
              >
                Sign in here
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;