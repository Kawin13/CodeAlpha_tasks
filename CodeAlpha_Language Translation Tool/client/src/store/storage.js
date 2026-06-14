const HISTORY_KEY = "gt-history";
const FAVS_KEY = "gt-favorites";
const MAX_HISTORY = 50;

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── History ──────────────────────────────────────────────────────────────────
export function getHistory() { return read(HISTORY_KEY); }

export function addHistory(entry) {
  const list = read(HISTORY_KEY);
  // Deduplicate by source+target+text
  const deduped = list.filter(
    (e) => !(e.source === entry.source && e.target === entry.target && e.input === entry.input)
  );
  deduped.unshift({ ...entry, id: Date.now() });
  write(HISTORY_KEY, deduped.slice(0, MAX_HISTORY));
}

export function clearHistory() { write(HISTORY_KEY, []); }

// ── Favorites ─────────────────────────────────────────────────────────────────
export function getFavorites() { return read(FAVS_KEY); }

export function toggleFavorite(entry) {
  const list = read(FAVS_KEY);
  const idx = list.findIndex((e) => e.id === entry.id);
  if (idx === -1) {
    list.unshift(entry);
  } else {
    list.splice(idx, 1);
  }
  write(FAVS_KEY, list);
  return idx === -1; // true = added
}

export function isFavorite(id) {
  return read(FAVS_KEY).some((e) => e.id === id);
}
