const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user; // attach user to req
    next();
  } catch (err) {
    console.error( err,"❌ Invalid or missing token");
    res.status(401).json({ error: "Unauthorized: Invalid or missing token" });
  }
};
module.exports = function (req, res, next) {
  if (!["admin", "superadmin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = protect;