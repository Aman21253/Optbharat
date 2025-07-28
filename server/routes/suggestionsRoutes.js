const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

// Load env
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 📥 Submit a new suggestion
router.post("/", async (req, res) => {
  const suggestion = req.body;

  try {
    const { data, error } = await supabase
      .from("suggestions")
      .insert([suggestion]);

    if (error) throw error;

    res.status(201).json({ message: "Suggestion submitted", suggestion: data[0] });
  } catch (err) {
    console.error("❌ Submission failed:", err.message);
    res.status(500).json({ error: "Failed to submit suggestion" });
  }
});

// 📄 Get all suggestions (for admin)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// ✅ Approve suggestion
router.post("/approve/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("suggestions")
      .update({ approved: true })
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Suggestion approved", suggestion: data[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve suggestion" });
  }
});

// ❌ Reject suggestion
router.delete("/reject/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("suggestions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Suggestion rejected" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject suggestion" });
  }
});

module.exports = router;