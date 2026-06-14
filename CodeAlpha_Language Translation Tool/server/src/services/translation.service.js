const logger = require("../utils/logger");
const cache = require("./cache.service");
const providerManager = require("./provider-manager");
const providers = require("./providers");

// Register providers in priority order
providerManager.register("LibreTranslate", providers.libreTranslate, 90000);
providerManager.register("LibreTranslateMirror", providers.libreTranslateMirror, 60000);
providerManager.register("MyMemory", providers.myMemory, 45000);
providerManager.register("Lingva", providers.lingvaTranslate, 45000);
providerManager.register("Google", providers.googleTranslate, 30000);

/**
 * Translate text using the best available provider.
 * Falls through the entire chain before giving up.
 */
async function translate({ text, source, target }) {
  // 1. Cache hit?
  const cached = cache.get(text, source, target);
  if (cached) {
    logger.debug("Cache hit", { source, target, chars: text.length });
    return { translatedText: cached, provider: "cache", cached: true };
  }

  const healthyProviders = providerManager.getHealthy();
  if (healthyProviders.length === 0) {
    // All providers down — reset everyone and try again
    logger.warn("All providers unhealthy, resetting");
    healthyProviders.push(...providerManager.getHealthy());
  }

  const errors = [];

  for (const provider of healthyProviders) {
    try {
      logger.info("Attempting translation", {
        provider: provider.name,
        source,
        target,
        chars: text.length,
      });

      const translatedText = await providers.withRetry(
        () => provider.fn({ text, source, target }),
        2,
        500
      );

      providerManager.markSuccess(provider.name);
      cache.set(text, source, target, translatedText);

      logger.info("Translation succeeded", { provider: provider.name });
      return { translatedText, provider: provider.name, cached: false };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || "Unknown error";
      logger.warn("Provider failed", { provider: provider.name, error: errMsg });
      providerManager.markFailed(provider.name);
      errors.push({ provider: provider.name, error: errMsg });
    }
  }

  // All providers failed
  logger.error("All providers exhausted", { errors });
  const err = new Error("All translation providers are currently unavailable.");
  err.providerErrors = errors;
  err.code = "ALL_PROVIDERS_FAILED";
  throw err;
}

/**
 * Get languages — try LibreTranslate first, fall back to built-in list
 */
async function getLanguages() {
  const baseURL =
    process.env.LIBRE_TRANSLATE_URL ||
    process.env.LIBRETRANSLATE_URL ||
    "https://libretranslate.com";

  try {
    const axios = require("axios");
    const { data } = await axios.get(`${baseURL}/languages`, { timeout: 8000 });
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // fall through to built-in
  }

  return require("./languages.data");
}

module.exports = { translate, getLanguages };
