const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtp } = require("./otpController");

// Sign Up
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    let role = "user";
    if (email === process.env.TRUSTED_ADMIN_EMAIL) {
      role = "admin";
    } else if (email === process.env.TRUSTED_SUPERADMIN_EMAIL) {
      role = "superadmin";
    }
    const user = await User.create({ name, email, password: hashedPassword, role });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
);

    // Trigger OTP
    await sendOtp(
      { body: { email } },
      {
        json: () => {},
        status: () => ({ json: () => {} }),
      }
    );

    res.status(201).json({
      message: "User registered. OTP sent.",
      user: { _id: user._id, name: user.name, email: user.email, role:user.role },
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
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // // ✅ Send OTP before response
    // await require("./otpController").sendOtp({ body: { email } }, {
    //   json: () => {},
    //   status: () => ({ json: () => {} }),
    // });

    // ✅ Now send response
    res.json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.suggestAlternative = async (req, res) => {
  res.send("Suggestion submitted");
};

exports.bookmarkBrand = async (req, res) => {
  const { userId, brandId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.bookmarks.indexOf(brandId);

    if (index === -1) {
      user.bookmarks.push(brandId); // Add
    } else {
      user.bookmarks.splice(index, 1); // Remove
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: "Bookmark failed" });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("bookmarks");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
};

exports.upvoteBrand = async (req, res) => {
  res.send("Brand upvoted");
};