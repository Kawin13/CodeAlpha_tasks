const NodeCache = require("node-cache");

// TTL: 1 hour, check period: 2 minutes
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

function makeCacheKey(text, source, target) {
  // Normalise to lowercase, trim whitespace
  return `${source}:${target}:${text.trim().toLowerCase()}`;
}

function get(text, source, target) {
  return cache.get(makeCacheKey(text, source, target)) ?? null;
}

function set(text, source, target, translated) {
  cache.set(makeCacheKey(text, source, target), translated);
}

function stats() {
  return cache.getStats();
}

module.exports = { get, set, stats };
