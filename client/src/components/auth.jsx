import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
      setMessage("⏳ Please wait before resending OTP");
      return;
    }

    if (!email) {
      setMessage("⚠️ Please enter your email first");
      return;
    }

    setIsLoading(true);
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
        setMessage("✅ OTP sent to your email");
        setResendTimer(60); // Start 60-second countdown
      } else {
        setMessage(data.error || "❌ Failed to send OTP");
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const email = isLogin ? loginForm.email : signupForm.email;
    setMessage("");

    if (!otp || otp.length !== 4) {
      setMessage("⚠️ Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsOtpVerified(true);
        setMessage("✅ OTP verified successfully");
      } else {
        setMessage(data.error || "❌ Invalid OTP. Please try again.");
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setMessage("⚠️ Please verify your OTP first");
      return;
    }

    setIsLoading(true);
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
        setMessage("✅ Success! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.error || "❌ Authentication failed");
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setIsLoading(false);
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
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            MakeInBharat
          </div>
          <h1 className="auth-title">
            {isLogin ? "Welcome Back" : "Join MakeInBharat"}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? "Sign in to your account to continue exploring Indian brands"
              : "Create your account to start discovering and supporting Indian brands"
            }
          </p>
        </div>

        <div className="auth-toggle">
          <button 
            className={isLogin ? "active" : ""} 
            onClick={() => {
              setIsLogin(true);
              setMessage("");
              setOtpVisible(false);
              setIsOtpVerified(false);
            }}
          >
            🔐 Login
          </button>
          <button 
            className={!isLogin ? "active" : ""} 
            onClick={() => {
              setIsLogin(false);
              setMessage("");
              setOtpVisible(false);
              setIsOtpVerified(false);
            }}
          >
            ✨ Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                👤 Full Name
              </label>
              <input
                className="form-input"
                name="name"
                type="text"
                placeholder="Enter your full name"
                onChange={handleChange}
                value={signupForm.name}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              📧 Email Address
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={currentForm.email}
                onChange={handleChange}
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="auth-button"
                onClick={handleSendOtp}
                disabled={isLoading || resendTimer > 0}
                style={{ 
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : otpVisible ? (
                  resendTimer > 0 ? `${resendTimer}s` : "🔄 Resend"
                ) : (
                  "📤 Send OTP"
                )}
              </button>
            </div>
          </div>

          {otpVisible && (
            <div className="form-group">
              <label className="form-label">
                🔢 OTP Verification
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  required
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  className="auth-button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || !otp || otp.length !== 4}
                  style={{ 
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    "✅ Verify"
                  )}
                </button>
              </div>
              {resendTimer > 0 && (
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "var(--text-secondary)", 
                  marginTop: "0.5rem",
                  textAlign: 'center'
                }}>
                  ⏰ Resend available in <strong>{resendTimer}s</strong>
                </p>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              🔒 Password
            </label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={currentForm.password}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <div className={message.includes("✅") ? "success-message" : "error-message"}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={!isOtpVerified || isLoading}
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
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setIsLogin(false);
                setMessage("");
                setOtpVisible(false);
                setIsOtpVerified(false);
              }}>
                Sign up here
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setIsLogin(true);
                setMessage("");
                setOtpVisible(false);
                setIsOtpVerified(false);
              }}>
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