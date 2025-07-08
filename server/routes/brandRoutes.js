const express = require("express");
const router = express.Router();
const protect=require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const brandCtrl = require("../controllers/brandController");

// Main brand routes
// New route: /api/brand/alternatives/:category
router.get("/alternatives/:category", (req, res) => {
  const category = req.params.category;
  const alternatives = indianAlternatives[category];

  if (alternatives && alternatives.length > 0) {
    res.json(alternatives);
  } else {
    res.json([]);
  }
});
router.post("/", protect, brandCtrl.createBrand);
router.get("/", brandCtrl.getAllBrands);
router.get("/:id/alternatives", brandCtrl.getAlternativesForBrand);
router.post("/suggest", brandCtrl.submitBrandSuggestion);
router.get("/pending", protect, isAdmin, brandCtrl.getPendingBrands);
router.put("/:id/approve", protect, isAdmin, brandCtrl.approveBrand);
router.delete("/:id", protect, isAdmin, brandCtrl.deleteBrand);
router.get("/:id", brandCtrl.getBrandById);

// Static Indian alternatives data
const indianAlternatives = {
  Footwear: [
    {
      name: "Bacca Bucci",
      productCategories: ["Footwear"],
      positioning: "Comparable",
      reason: "Indian D2C brand offering stylish, durable shoes at competitive prices.",
      website: "https://baccabucci.com",
    },
    {
      name: "Liberty Shoes",
      productCategories: ["Footwear"],
      positioning: "Mass-market",
      reason: "Well-established Indian brand offering affordable footwear.",
      website: "https://www.libertyshoesonline.com",
    },
    {
      name:"Red Tape",
      productCategories: ["Footwear"],
      positioning: "Mass-market",
      reason: "Offers stylish and durable footwear at affordable prices.",
      website: "https://www.redchief.in",
    },
    {
      name:"WoodLand",
      productCategories: ["Footwear"],
      positioning: "Premium",
      reason: "Known for rugged outdoor footwear suitable for adventurous activities.",
      website: "https://www.woodlandworldwide.com",
    },
  ],
  Electronics: [
    {
      name: "Boat",
      productCategories: ["Audio", "Wearables"],
      positioning: "Mass-market",
      reason: "Affordable and trendy electronics made in India.",
      website: "https://www.boat-lifestyle.com",
    },
    {
      name: "Noise",
      productCategories: ["Smartwatches", "Audio"],
      positioning: "Comparable",
      reason: "Indian brand making a mark in smart wearables.",
      website: "https://www.gonoise.com",
    },
  ],
  Computers: [
    {
      name: "iBall",
      productRange:"100000",
      productCategories: ["Laptops, Peripherals"],
      positioning:"Budget-Friendly",
      reason:"Offers affordable laptops like the CompBook series, suitable for students and everyday use.",
      website:"https://www.iball.co.in",
    },
    {
      name: "HCL",
      productCategories: ["Laptops"],
      positioning:"Mid-range",
      reason:"Offers notebooks and ultra-portable laptops at attractive prices, popular among students.",
      website:"https://www.hcltech.com",
    },
  ],
  Apparel: [
    {
      name: "FabIndia",
      productCategories: ["Apparel"],
      positioning:"Mid-range",
      reason:"Offers notebooks and ultra-portable laptops at attractive prices, popular among students.",
      website:"https://www.fabindia.com/",
    }
  ]
};

module.exports = router;