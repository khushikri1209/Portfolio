const express = require("express");
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogCover,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadImage } = require("../middleware/upload");

const router = express.Router();

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);
router.post(
  "/:id/cover",
  protect,
  adminOnly,
  uploadImage.single("coverImage"),
  uploadBlogCover
);

module.exports = router;
