const Skill = require("../models/Skill");

const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Not found" });
    res.json(skill);
  } catch (err) {
    next(err);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ message: "Not found" });
    res.json(skill);
  } catch (err) {
    next(err);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

const uploadSkillIcon = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No icon uploaded" });
    }

    skill.icon = req.file.path;
    await skill.save();

    res.json(skill);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  uploadSkillIcon,
};
