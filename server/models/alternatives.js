const mongoose = require("mongoose");

const AlternativeSchema = new mongoose.Schema(
  {
    globalBrandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GlobalBrand",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    positioning: {
      type: String,
      enum: ["mass-market", "comparable", "premium"],
    },
    reason: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`,
      },
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alternative", AlternativeSchema);