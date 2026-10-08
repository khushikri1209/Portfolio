const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["frontend", "backend", "tools"],
      required: true,
    },
    level: { type: Number, min: 0, max: 100, default: 0 },
    icon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
