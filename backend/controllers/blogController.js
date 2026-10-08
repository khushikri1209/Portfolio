const Blog = require("../models/Blog");

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const generateUniqueSlug = async (title) => {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (await Blog.exists({ slug })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const getBlogs = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const filter = {};

    if (req.query.published !== undefined) {
      filter.published = req.query.published === "true";
    }

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      data: blogs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const slug = await generateUniqueSlug(title);
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (update.title && !update.slug) {
      update.slug = await generateUniqueSlug(update.title);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

const uploadBlogCover = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No cover image uploaded" });
    }

    blog.coverImage = req.file.path;
    await blog.save();

    res.json(blog);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogCover,
};
