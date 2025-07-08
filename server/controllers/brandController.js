const Brand = require("../models/brand");
const Alternative = require("../models/alternatives");
const Suggestion = require("../models/brandSuggestion");

exports.getAllBrands = async (req, res) => {
  try {
    const { name, countryOfOrigin, productCategory } = req.query;

    const query = { approved: true };

    if (name || countryOfOrigin || productCategory) {
      query.$or = [];

      if (name) {
        query.$or.push({ name: { $regex: name, $options: "i" } });
      }

      if (countryOfOrigin) {
        query.$or.push({ countryOfOrigin: { $regex: countryOfOrigin, $options: "i" } });
      }

      if (productCategory) {
        query.$or.push({ productCategory: { $regex: productCategory, $options: "i" } });
      }
    }

    const brands = await Brand.find(query);
    
    res.status(200).json(brands);
  } catch (err) {
    console.error("❌ Error fetching brands:", err);
    res.status(500).json({ error: "Error fetching brands" });
  }
};
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const brand = new Brand({
      ...req.body,
      approved: false,
      createdBy: req.user.userId,
      submitterEmail: req.user.email,
    });
    await brand.save();
    res.status(201).json({ message: "Listing submitted for approval." });
  } catch (err) {
    console.error("Brand submit error:", err);
    res.status(500).json({ error: "Failed to add brand" });
  }
};

exports.addBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json({ message: "Brand added successfully" })
  }catch(err){
    res.status(400).json({ error: "Failed to add brand" });;
  }
};

exports.submitBrandSuggestion = async (req, res) => {
  try {
    const suggestion = new Suggestion(req.body);
    await suggestion.save();
    res.status(201).json({ message: "Submission received. Awaiting approval." });
  } catch (err) {
    res.status(500).json({ error: "Submission failed." });
  }
};

exports.getPendingBrands = async (req, res) => {
  try {
    const pending = await Brand.find({ approved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending brands" });
  }
};

exports.approveBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    brand.approved = true;
    await brand.save();

    res.json({ message: "Brand approved", brand });
  } catch (err) {
    console.error("Error approving brand:", err);
    res.status(500).json({ error: "Failed to approve brand" });
  }
};

exports.getAlternativesForBrand = async (req, res) => {
  try {
    const alternatives = await Alternative.find({ globalBrandId: req.params.id });
    res.status(200).json(alternatives);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alternatives" });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    const email = brand.submitterEmail;
    if (brand.createdBy?.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await brand.deleteOne();
    if (email) {
    await sendEmail({
      to: email,
      subject: "Your brand listing was not approved",
      text: `Hi, your submitted brand "${brand.name}" was not approved by the admin.`,
    });
  }
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting brand" });
  }
};