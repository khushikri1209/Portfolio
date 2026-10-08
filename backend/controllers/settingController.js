const Setting = require("../models/Setting");

const PUBLIC_KEYS = [
  "siteTitle",
  "bio",
  "socialLinks",
  "resumeUrl",
  "themeColors",
];

const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({ key: { $in: PUBLIC_KEYS } });
    const data = PUBLIC_KEYS.reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {});

    settings.forEach((setting) => {
      data[setting.key] = setting.value;
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (!setting) return res.status(404).json({ message: "Not found" });
    res.json(setting);
  } catch (err) {
    next(err);
  }
};

const createSetting = async (req, res, next) => {
  try {
    const setting = await Setting.create(req.body);
    res.status(201).json(setting);
  } catch (err) {
    next(err);
  }
};

const updateSetting = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid settings payload" });
    }

    const entries = Object.entries(req.body);
    if (!entries.length) {
      return res.status(400).json({ message: "No settings provided" });
    }

    await Promise.all(
      entries.map(([key, value]) =>
        Setting.findOneAndUpdate(
          { key },
          { value },
          { new: true, upsert: true, runValidators: true }
        )
      )
    );

    const settings = await Setting.find({ key: { $in: PUBLIC_KEYS } });
    const data = PUBLIC_KEYS.reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {});

    settings.forEach((setting) => {
      data[setting.key] = setting.value;
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);
    if (!setting) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const setting = await Setting.findOneAndUpdate(
      { key: "resumeUrl" },
      { value: req.file.path },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(setting);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  uploadResume,
};
