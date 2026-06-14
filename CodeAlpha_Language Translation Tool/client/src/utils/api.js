const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const FRIENDLY = {
  ALL_PROVIDERS_FAILED: "Trying alternative translation services…",
  RATE_LIMIT: "Too many requests — please wait a moment.",
  VALIDATION_ERROR: null, // pass through
};

function friendlyMessage(data) {
  if (data?.code && FRIENDLY[data.code] !== undefined) {
    return FRIENDLY[data.code] ?? data.error;
  }
  if (data?.error) return data.error;
  return "Translation unavailable right now. Please try again.";
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(friendlyMessage(data));
    err.code = data?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function translateText({ text, source, target }) {
  return apiFetch("/api/translate", {
    method: "POST",
    body: JSON.stringify({ text, source, target }),
  });
}

export async function fetchLanguages() {
  return apiFetch("/api/languages");
}

export async function fetchHealth() {
  return apiFetch("/api/health");
}

export async function fetchProviders() {
  return apiFetch("/api/providers");
}
