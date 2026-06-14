const logger = require("../utils/logger");

// ─── Provider registry ────────────────────────────────────────────────────────
// Each entry: { name, fn, healthy, failCount, lastFailAt, cooldownMs }
const PROVIDERS = [];

function register(name, fn, cooldownMs = 60000) {
  PROVIDERS.push({
    name,
    fn,
    healthy: true,
    failCount: 0,
    lastFailAt: null,
    cooldownMs,
  });
}

function getHealthy() {
  const now = Date.now();
  return PROVIDERS.filter((p) => {
    if (p.healthy) return true;
    // Auto-recover after cooldown
    if (p.lastFailAt && now - p.lastFailAt >= p.cooldownMs) {
      p.healthy = true;
      p.failCount = 0;
      logger.info("Provider recovered", { provider: p.name });
      return true;
    }
    return false;
  });
}

function markFailed(name) {
  const p = PROVIDERS.find((x) => x.name === name);
  if (!p) return;
  p.failCount += 1;
  p.lastFailAt = Date.now();
  // Disable after 3 consecutive failures
  if (p.failCount >= 3) {
    p.healthy = false;
    logger.warn("Provider disabled due to repeated failures", {
      provider: p.name,
      failCount: p.failCount,
    });
  }
}

function markSuccess(name) {
  const p = PROVIDERS.find((x) => x.name === name);
  if (!p) return;
  p.healthy = true;
  p.failCount = 0;
}

function getStatus() {
  return PROVIDERS.map(({ name, healthy, failCount, lastFailAt }) => ({
    name,
    healthy,
    failCount,
    lastFailAt,
  }));
}

module.exports = { register, getHealthy, markFailed, markSuccess, getStatus };
