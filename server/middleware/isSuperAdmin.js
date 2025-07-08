module.exports = function (req, res, next) {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin only" });
  }
  next();
};