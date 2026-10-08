const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Blog = require("../models/Blog");
const Message = require("../models/Message");
const Setting = require("../models/Setting");

const getOverview = async (req, res, next) => {
  try {
    const [projects, skills, blogs, messages] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments(),
    ]);

    res.json({ projects, skills, blogs, messages });
  } catch (err) {
    next(err);
  }
};

const getVisitors = async (req, res, next) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: "visitorCount" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    res.json({ visitors: setting.value || 0 });
  } catch (err) {
    next(err);
  }
};

const getUnreadMessages = async (req, res, next) => {
  try {
    const unread = await Message.countDocuments({ status: "unread" });
    res.json({ unread });
  } catch (err) {
    next(err);
  }
};

const getProjectStats = async (req, res, next) => {
  try {
    const [total, featured] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
    ]);

    res.json({ total, featured });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview,
  getVisitors,
  getUnreadMessages,
  getProjectStats,
};
