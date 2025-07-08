const Alternative = require("../models/Alternative");

exports.createAlternative = async (req, res) => {
  try {
    const alt = await Alternative.create(req.body);
    res.status(201).json(alt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAlternativesByBrand = async (req, res) => {
  try {
    const alternatives = await Alternative.find({ globalBrandId: req.params.brandId });
    res.status(200).json(alternatives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};