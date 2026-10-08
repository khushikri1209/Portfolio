const express = require("express");
const {
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  uploadResume,
} = require("../controllers/settingController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadPdf } = require("../middleware/upload");

const router = express.Router();

router.get("/", getSettings);
router.post("/resume", protect, adminOnly, uploadPdf.single("resume"), uploadResume);
router.put("/", protect, adminOnly, updateSetting);
router.get("/:id", getSetting);
router.post("/", protect, createSetting);
router.put("/:id", protect, updateSetting);
router.delete("/:id", protect, deleteSetting);

module.exports = router;
