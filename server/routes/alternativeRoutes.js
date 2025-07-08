const express = require("express");
const router = express.Router();

// Example test route
router.get("/", (req, res) => {
  res.send("Alternative Routes working!");
});

module.exports = router;