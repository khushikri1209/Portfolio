const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    githubLink: { type: String },
    liveLink: { type: String },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
