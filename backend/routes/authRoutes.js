const express = require("express");
const { body, validationResult } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");
const { authLimiter } = require("../config/rateLimit");

const router = express.Router();

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

router.post(
	"/register",
	authLimiter,
	[
		body("name").trim().notEmpty(),
		body("email").trim().isEmail(),
		body("password").isLength({ min: 6 }),
	],
	validate,
	register
);
router.post(
	"/login",
	authLimiter,
	[body("email").trim().isEmail(), body("password").notEmpty()],
	validate,
	login
);
router.get("/me", protect, adminOnly, getMe);

module.exports = router;
