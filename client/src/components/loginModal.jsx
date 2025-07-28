import React, { useState } from "react";
import "./loginModal.css";
import { supabase } from "../supabaseClient";

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setMessage("❌ " + error.message);
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.session?.access_token);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          close();
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal" onClick={close}>
      <div className="login-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>
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

        <div className="modal-footer">
          Don’t have an account?{" "}
          <a
            href="/auth?signup=true"
            onClick={(e) => {
              e.preventDefault();
              close();
              window.location.href = "/auth?signup=true";
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