const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const name = process.env.ADMIN_NAME || "Admin";
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
      process.exit(1);
    }

    await User.create({ name, email, password, role: "admin" });
    console.log("Admin created");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedAdmin();
