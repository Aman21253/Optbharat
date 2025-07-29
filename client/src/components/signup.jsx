import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
    setMessage(""); // Clear message when switching
    setForm({ name: "", email: "", password: "" }); // Reset form
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const url = isLogin
      ? "https://makeinindia-ktgc.onrender.com/api/users/login"
      : "https://makeinindia-ktgc.onrender.com/api/users/register";
  
    const payload = isLogin
      ? { email: form.email.trim(), password: form.password }
      : {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        };
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setMessage("Success!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => handleToggle(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => handleToggle(false)}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-form-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Create Account"}</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Auth;