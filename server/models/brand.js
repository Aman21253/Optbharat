const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  countryOfOrigin:String,
  countryOfOperation:  String,
  productCategory: String,
  description: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  alternatives: [
    {
      name: String,
      productCategories: [String],
      marketPositioning:  { type: String, required: true },
      reason:  { type: String, required: true },
      website:  { type: String, required: true },
    }
  ],
  approved: { type: Boolean, default: false },
  submitterEmail: { type: String },
});

module.exports = mongoose.model("Brand", brandSchema);

