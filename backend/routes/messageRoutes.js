const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  getMessages,
  createMessage,
  updateMessage,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/messageController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/",
  [
    body("name").trim().notEmpty(),
    body("email").trim().isEmail(),
    body("message").trim().notEmpty(),
  ],
  validate,
  createMessage
);
router.get("/", protect, adminOnly, getMessages);
router.put("/:id", protect, adminOnly, updateMessage);
router.put(
  "/:id/status",
  protect,
  adminOnly,
  [body("status").isIn(["unread", "read", "replied"])],
  validate,
  updateMessageStatus
);
router.delete("/:id", protect, adminOnly, deleteMessage);

module.exports = router;
