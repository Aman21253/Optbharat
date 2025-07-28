require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create a new alternative
exports.createAlternative = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alternatives")
      .insert([req.body]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create alternative" });
  }
};

// Get alternatives for a specific global brand
exports.getAlternativesByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const { data, error } = await supabase
      .from("alternatives")
      .select("*")
      .eq("globalBrandId", brandId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alternatives" });
  }
};