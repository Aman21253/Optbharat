require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');
const Suggestion = require("../models/brandSuggestion");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ✅ Get all approved brands with optional search filters
exports.getAllBrands = async (req, res) => {
  try {
    const { name, country_of_origin, product_category } = req.query;

    let query = supabase
      .from("brands")
      .select("*")
      .eq("approved", true);

    if (name) {
      query = query.ilike("name", `%${name}%`);
    }
    if (country_of_origin) {
      query = query.ilike("country_of_origin", `%${country_of_origin}%`);
    }
    if (product_category) {
      query = query.ilike("product_category", `%${product_category}%`);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
  } catch (err) {
    console.error("Supabase fetch error:", err);
    res.status(500).json({ error: "Failed to fetch brands from Supabase" });
  }
};

// ✅ Get single brand by ID
exports.getBrandById = async (req, res) => {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Brand not found" });
  }

  res.json(data);
};

// ✅ Submit new brand (pending approval)
exports.createBrand = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      approved: false,
      createdBy: req.user.userId,
      submitterEmail: req.user.email,
    };

    const { error } = await supabase.from("brands").insert([payload]);

    if (error) throw error;

    res.status(201).json({ message: "Listing submitted for approval." });
  } catch (err) {
    console.error("Brand submit error:", err);
    res.status(500).json({ error: "Failed to add brand" });
  }
};

// ✅ Add a brand directly (admin only)
exports.addBrand = async (req, res) => {
  try {
    const { error } = await supabase
      .from("brands")
      .insert([{ ...req.body, approved: true }]);

    if (error) throw error;

    res.status(201).json({ message: "Brand added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to add brand" });
  }
};

// ✅ Suggest brand via MongoDB
exports.submitBrandSuggestion = async (req, res) => {
  try {
    const suggestion = new Suggestion(req.body);
    await suggestion.save();
    res.status(201).json({ message: "Submission received. Awaiting approval." });
  } catch (err) {
    res.status(500).json({ error: "Submission failed." });
  }
};

// ✅ Get pending brands
exports.getPendingBrands = async (req, res) => {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("approved", false);

  if (error) {
    return res.status(500).json({ error: "Failed to fetch pending brands" });
  }

  res.json(data);
};

// ✅ Approve a brand (by ID)
exports.approveBrand = async (req, res) => {
  const { data, error } = await supabase
    .from("brands")
    .update({ approved: true })
    .eq("id", req.params.id);

  if (error || data.length === 0) {
    return res.status(500).json({ error: "Failed to approve brand" });
  }

  res.json({ message: "Brand approved", brand: data[0] });
};

// ✅ Get alternatives for brand from Supabase
exports.getAlternativesForBrand = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alternatives")
      .select("*")
      .eq("globalBrandId", req.params.id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alternatives" });
  }
};

// ✅ Delete brand with ownership check
exports.deleteBrand = async (req, res) => {
  try {
    const { data: brand, error: findError } = await supabase
      .from("brands")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (findError || !brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    if (brand.createdBy !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { error: deleteError } = await supabase
      .from("brands")
      .delete()
      .eq("id", req.params.id);

    if (deleteError) throw deleteError;

    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting brand" });
  }
};