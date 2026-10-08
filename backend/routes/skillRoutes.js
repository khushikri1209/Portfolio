const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  uploadSkillIcon,
} = require("../controllers/skillController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post(
  "/",
  protect,
  adminOnly,
  [body("name").notEmpty(), body("category").notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createSkill
);
router.put("/:id", protect, adminOnly, updateSkill);
router.delete("/:id", protect, adminOnly, deleteSkill);
router.post(
  "/:id/icon",
  protect,
  adminOnly,
  uploadImage.single("icon"),
  uploadSkillIcon
);

module.exports = router;
