const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
