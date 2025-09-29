const jwt = require("jsonwebtoken");

// Protect middleware: verify JWT and attach user info from token
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token is created in userController with { userId, role }, so trust those values
    req.user = { id: decoded.userId, role: decoded.role };

    // Log who is calling
    console.log(
      `[AUTH] ${req.method} ${req.originalUrl} -> userId=${req.user.id} role=${req.user.role}`
    );

    next();
  } catch (err) {
    console.error("❌ Invalid or missing token:", err?.message || err);
    res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
  }
};

module.exports = protect;