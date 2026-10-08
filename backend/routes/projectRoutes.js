const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
} = require("../controllers/projectController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post(
  "/",
  protect,
  adminOnly,
  uploadImage.array("images", 5),
  [body("title").notEmpty(), body("description").notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createProject
);
router.put("/:id", protect, adminOnly, uploadImage.array("images", 5), updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);
router.post(
  "/:id/upload-images",
  protect,
  adminOnly,
  uploadImage.array("images", 5),
  uploadProjectImages
);

module.exports = router;
