const { Router } = require("express");
const providerManager = require("../services/provider-manager");
const cache = require("../services/cache.service");

const router = Router();

// GET /api/health
router.get("/health", (req, res) => {
  const providers = providerManager.getStatus();
  const anyHealthy = providers.some((p) => p.healthy);
  res.status(anyHealthy ? 200 : 503).json({
    status: anyHealthy ? "healthy" : "degraded",
    translation: anyHealthy ? "working" : "degraded",
    activeProvider: providers.find((p) => p.healthy)?.name ?? "none",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/providers
router.get("/providers", (req, res) => {
  res.json({
    providers: providerManager.getStatus(),
    cache: cache.stats(),
  });
});

module.exports = router;
