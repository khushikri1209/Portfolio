const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { limiter } = require("./config/rateLimit");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

connectDB();

app.use(express.json({ limit: "5mb" }));
const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(limiter);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`DB connected & server running on port ${PORT}`);
});
