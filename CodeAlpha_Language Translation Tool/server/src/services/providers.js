const axios = require("axios");
const logger = require("../utils/logger");

// ─── Shared HTTP helper ───────────────────────────────────────────────────────
function makeClient(baseURL, timeout = 12000) {
  return axios.create({ baseURL, timeout, headers: { "Content-Type": "application/json" } });
}

// ─── Helper: retry with exponential backoff ───────────────────────────────────
async function withRetry(fn, retries = 2, baseDelayMs = 400) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

// ─── Provider 1: LibreTranslate ───────────────────────────────────────────────
async function libreTranslate({ text, source, target }) {
  const baseURL =
    process.env.LIBRE_TRANSLATE_URL ||
    process.env.LIBRETRANSLATE_URL ||
    "https://libretranslate.com";
  const client = makeClient(baseURL, 14000);
  const payload = { q: text, source, target, format: "text" };
  const apiKey =
    process.env.LIBRE_TRANSLATE_API_KEY ||
    process.env.LIBRETRANSLATE_API_KEY ||
    "";
  if (apiKey) payload.api_key = apiKey;

  const { data } = await client.post("/translate", payload);
  if (!data?.translatedText) throw new Error("Empty LibreTranslate response");
  return data.translatedText;
}

// ─── Provider 2: LibreTranslate mirror (argosopentech) ───────────────────────
async function libreTranslateMirror({ text, source, target }) {
  const mirrors = [
    "https://translate.argosopentech.com",
    "https://translate.fortytwo-it.com",
    "https://lt.vern.cc",
  ];
  let lastErr;
  for (const mirror of mirrors) {
    try {
      const client = makeClient(mirror, 12000);
      const { data } = await client.post("/translate", {
        q: text,
        source,
        target,
        format: "text",
      });
      if (data?.translatedText) return data.translatedText;
    } catch (err) {
      lastErr = err;
      logger.debug("LibreTranslate mirror failed", { mirror, err: err.message });
    }
  }
  throw lastErr ?? new Error("All LibreTranslate mirrors failed");
}

// ─── Provider 3: MyMemory ─────────────────────────────────────────────────────
async function myMemory({ text, source, target }) {
  const client = makeClient("https://api.mymemory.translated.net", 10000);
  const langpair = `${source === "auto" ? "en" : source}|${target}`;
  const email = process.env.MYMEMORY_EMAIL || "";
  const url = `/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}${email ? `&de=${encodeURIComponent(email)}` : ""}`;
  const { data } = await client.get(url);
  if (data?.responseStatus !== 200) {
    throw new Error(data?.responseDetails || "MyMemory error");
  }
  const translated = data?.responseData?.translatedText;
  if (!translated) throw new Error("MyMemory: empty translation");
  // MyMemory returns error strings sometimes
  if (translated.toUpperCase() === text.toUpperCase()) {
    throw new Error("MyMemory: no translation performed");
  }
  return translated;
}

// ─── Provider 4: Lingva Translate (Google-compatible, no key) ─────────────────
async function lingvaTranslate({ text, source, target }) {
  const instances = [
    "https://lingva.ml",
    "https://lingva.garudalinux.org",
  ];
  const src = source === "auto" ? "auto" : source;
  let lastErr;
  for (const base of instances) {
    try {
      const client = makeClient(base, 10000);
      const { data } = await client.get(
        `/api/v1/${encodeURIComponent(src)}/${encodeURIComponent(target)}/${encodeURIComponent(text)}`
      );
      if (data?.translation) return data.translation;
    } catch (err) {
      lastErr = err;
      logger.debug("Lingva instance failed", { base, err: err.message });
    }
  }
  throw lastErr ?? new Error("All Lingva instances failed");
}

// ─── Provider 5: Google Translate v2 (requires API key) ──────────────────────
async function googleTranslate({ text, source, target }) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.TRANSLATE_API_KEY;
  if (!apiKey) throw new Error("Google API key not configured");
  const client = makeClient("https://translation.googleapis.com", 10000);
  const { data } = await client.post(
    `/language/translate/v2?key=${apiKey}`,
    {
      q: text,
      source: source === "auto" ? undefined : source,
      target,
      format: "text",
    }
  );
  const translated = data?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error("Google Translate: empty response");
  return translated;
}

// ─── Export all providers ─────────────────────────────────────────────────────
module.exports = {
  libreTranslate,
  libreTranslateMirror,
  myMemory,
  lingvaTranslate,
  googleTranslate,
  withRetry,
};
