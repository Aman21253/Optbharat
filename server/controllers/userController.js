const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("./otpController");
const { createClient } = require('@supabase/supabase-js');
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sign Up
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { data: existing, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    let role = "user";

    if (email === process.env.TRUSTED_ADMIN_EMAIL) {
      role = "admin";
    } else if (email === process.env.TRUSTED_SUPERADMIN_EMAIL) {
      role = "superadmin";
    }

    const { data: user, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword, role }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send OTP (optional for production)
    await sendOtp(
      { body: { email } },
      {
        json: () => {},
        status: () => ({ json: () => {} }),
      }
    );

    res.status(201).json({
      message: "User registered. OTP sent.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Bookmark Brand
exports.bookmarkBrand = async (req, res) => {
  const { userId, brandId } = req.body;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("bookmark")
      .select("*")
      .eq("user_id", userId)
      .eq("brand_id", brandId)
      .single();

    if (existing) {
      // Unbookmark
      await supabase
        .from("bookmark")
        .delete()
        .eq("id", existing.id);
    } else {
      // Bookmark
      await supabase
        .from("bookmark")
        .insert([{ user_id: userId, brand_id: brandId }]);
    }

    const { data: bookmarks } = await supabase
      .from("bookmark")
      .select("brand_id")
      .eq("user_id", userId);

    res.json({ bookmarks: bookmarks.map(b => b.brand_id) });
  } catch (err) {
    console.error("Bookmark error:", err);
    res.status(500).json({ error: "Bookmark failed" });
  }
};

// Get Bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("bookmark")
      .select("brand_id")
      .eq("user_id", req.params.userId);

    if (error) throw error;

    res.json({ bookmarks: data.map(b => b.brand_id) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
};

// Placeholder for upvote
exports.upvoteBrand = async (req, res) => {
  res.send("Brand upvoted");
};

// Placeholder for suggestion
exports.suggestAlternative = async (req, res) => {
  res.send("Suggestion submitted");
};