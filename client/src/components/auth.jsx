import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginForm({ ...loginForm, [name]: value });
    } else {
      setSignupForm({ ...signupForm, [name]: value });
    }
  };

  const handleSendOtp = async () => {
    const email = isLogin ? loginForm.email : signupForm.email;
    setMessage("");

    if (resendTimer > 0) {
      setMessage("⏳ Resending OTP...");
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpVisible(true);
        setIsOtpVerified(false);
        setMessage("✅ OTP sent to email");
        setResendTimer(60); // Start 60-second countdown
      } else {
        setMessage(data.error || "❌ Failed to send OTP");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  const handleVerifyOtp = async () => {
    const email = isLogin ? loginForm.email : signupForm.email;
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsOtpVerified(true);
        setMessage("✅ OTP verified");
      } else {
        setMessage(data.error || "❌ Invalid OTP");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setMessage("⚠️ Please verify your OTP first");
      return;
    }

    const url = isLogin
      ? "http://localhost:8080/api/users/login"
      : "http://localhost:8080/api/users/register";

    const payload = isLogin ? loginForm : signupForm;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Logged in user:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setMessage(data.error || "❌ Failed");
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  const currentForm = isLogin ? loginForm : signupForm;

  // Countdown effect for Resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
        <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>

      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
            value={signupForm.name}
            required
          />
        )}

        <div className="flex-row">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={currentForm.email}
            onChange={handleChange}
            required
            style={{ width: "80%" }}
          />
          <button
            type="button"
            onClick={handleSendOtp}
          >
            {otpVisible ? "Resend OTP" : "Send OTP"}
          </button>
        </div>

        {otpVisible && (
            <div style={{ marginTop: "10px" }}>
              <div className="flex-row">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                  style={{ width: "60%" }}
                />
                <button type="button" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
             </div>

    {resendTimer > 0 && (
      <p style={{ fontSize: "13px", color: "gray", marginTop: "5px" }}>
        You can resend OTP in <strong>{resendTimer}s</strong>
      </p>
    )}
  </div>
)}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={currentForm.password}
          onChange={handleChange}
          required
          style={{ marginTop: "10px" }}
        />

        <button
          type="submit"
          disabled={!isOtpVerified}
          style={{
            marginTop: "15px",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px",
            border: "none",
            width: "100%",
            cursor: !isOtpVerified ? "not-allowed" : "pointer",
            opacity: !isOtpVerified ? 0.6 : 1,
          }}
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
      </form>
    </div>
  );
}

export default Auth;