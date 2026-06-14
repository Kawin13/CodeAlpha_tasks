require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const translateRouter = require("./routes/translate");
const languagesRouter = require("./routes/languages");
const systemRouter = require("./routes/system");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Trust proxy (Render, Railway, etc.) ─────────────────────────────────────
app.set("trust proxy", 1);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const rawOrigins = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = rawOrigins
  ? rawOrigins.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, same-origin)
      if (!origin) return cb(null, true);
      // Development: allow all localhost
      if (!rawOrigins && origin.match(/^http:\/\/localhost(:\d+)?$/)) {
        return cb(null, true);
      }
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "20kb" }));

// ─── Global rate limiter ──────────────────────────────────────────────────────
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: "Too many requests. Please wait a moment before trying again.",
        code: "RATE_LIMIT",
      });
    },
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/translate", translateRouter);
app.use("/api/languages", languagesRouter);
app.use("/api", systemRouter);

// Convenience: root health check
app.get("/", (req, res) => res.redirect("/api/health"));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info("Global Translator API started", {
    port: PORT,
    env: process.env.NODE_ENV || "development",
    libreTranslateUrl:
      process.env.LIBRE_TRANSLATE_URL ||
      process.env.LIBRETRANSLATE_URL ||
      "https://libretranslate.com",
  });
});
