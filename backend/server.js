require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.set("trust proxy", 1); // correct https URLs behind Render's proxy
app.disable("x-powered-by");
// the frontend lives on another origin and loads /uploads images, so allow cross-origin resource loads
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// baseline per-IP limit for the whole API (stricter limits sit on the auth routes)
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: (req) => req.path === "/health",
    message: { message: "Too many requests. Please try again later." },
  })
);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      // dev convenience: Vite may fall back to another port, or be opened via 127.0.0.1
      if (process.env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return cb(null, true);
      }
      const err = new Error(`Origin ${origin} is not allowed by CORS`);
      err.status = 403;
      return cb(err);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.json({ name: "Expense Tracker API", status: "ok" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Central error handler (multer, CORS, unexpected errors)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
