const Project = require("../models/Project");

const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);

    res.json({
      data: projects,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const files = req.files || [];
    const images = files.map((file) => file.path);
    const project = await Project.create({
      ...req.body,
      images,
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    Object.entries(req.body || {}).forEach(([key, value]) => {
      project[key] = value;
    });

    const files = req.files || [];
    if (files.length) {
      const imageUrls = files.map((file) => file.path);
      project.images = [...(project.images || []), ...imageUrls];
    }

    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

const uploadProjectImages = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUrls = files.map((file) => file.path);
    project.images = [...(project.images || []), ...imageUrls];
    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
};
