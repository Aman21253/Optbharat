const express = require("express");
const router = express.Router();

let suggestions = []; // In-memory array for now

// Get all suggestions (for admin)
router.get("/", (req, res) => {
  res.json(suggestions);
});

// Submit new suggestion (from SuggestBrand form)
router.post("/", (req, res) => {
  const suggestion = req.body;
  suggestion.id = Date.now().toString(); // Unique ID
  suggestions.push(suggestion);
  res.status(201).json({ message: "Suggestion submitted", suggestion });
});

// Approve suggestion
router.post("/approve/:id", (req, res) => {
  const { id } = req.params;
  const suggestion = suggestions.find(s => s.id === id);
  if (suggestion) {
    // Normally, you’d move it to the real DB here
    suggestions = suggestions.filter(s => s.id !== id);
    res.json({ message: "Suggestion approved", suggestion });
  } else {
    res.status(404).json({ message: "Suggestion not found" });
  }
});

// Reject suggestion
router.delete("/reject/:id", (req, res) => {
  const { id } = req.params;
  suggestions = suggestions.filter(s => s.id !== id);
  res.json({ message: "Suggestion rejected" });
});

module.exports = router;