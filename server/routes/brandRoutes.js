const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const brandCtrl = require("../controllers/brandController");
const indianAlternatives = require("../utils/indianAlternative");

// Return static Indian alternatives based on category
router.get("/alternatives/:category", (req, res) => {
  const category = req.params.category;
  const alternatives = indianAlternatives[category] || [];
  res.json(alternatives);
});

// Brand operations
router.post("/", protect, brandCtrl.createBrand);
router.get("/", brandCtrl.getAllBrands);
router.get("/:id/alternatives", brandCtrl.getAlternativesForBrand);
router.post("/suggest", brandCtrl.submitBrandSuggestion);
router.get("/pending", protect, isAdmin, brandCtrl.getPendingBrands);
router.put("/:id/approve", protect, isAdmin, brandCtrl.approveBrand);
router.delete("/:id", protect, isAdmin, brandCtrl.deleteBrand);
router.get("/:id", brandCtrl.getBrandById);

module.exports = router;