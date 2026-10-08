const express = require("express");
const {
	getOverview,
	getVisitors,
	getUnreadMessages,
	getProjectStats,
} = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/overview", protect, adminOnly, getOverview);
router.get("/visitors", protect, adminOnly, getVisitors);
router.get("/messages", protect, adminOnly, getUnreadMessages);
router.get("/projects", protect, adminOnly, getProjectStats);

module.exports = router;
