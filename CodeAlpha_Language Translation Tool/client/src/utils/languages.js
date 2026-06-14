// Map language codes to regional indicator emojis (flag)
const FLAG_MAP = {
  en: "🇺🇸", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹",
  pt: "🇧🇷", ru: "🇷🇺", zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷",
  ar: "🇸🇦", hi: "🇮🇳", tr: "🇹🇷", pl: "🇵🇱", nl: "🇳🇱",
  sv: "🇸🇪", da: "🇩🇰", fi: "🇫🇮", nb: "🇳🇴", uk: "🇺🇦",
  cs: "🇨🇿", ro: "🇷🇴", hu: "🇭🇺", id: "🇮🇩", vi: "🇻🇳",
  th: "🇹🇭", el: "🇬🇷", bg: "🇧🇬", sk: "🇸🇰", ca: "🏳️",
  he: "🇮🇱", fa: "🇮🇷", ms: "🇲🇾", az: "🇦🇿", sq: "🇦🇱",
  af: "🇿🇦", ga: "🇮🇪", cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", eu: "🏳️", gl: "🏳️",
  la: "🏛️", eo: "🟢", auto: "🌐",
};

export function getFlag(code) {
  return FLAG_MAP[code] ?? "🌐";
}

export function sortLanguages(langs) {
  return [...langs].sort((a, b) => a.name.localeCompare(b.name));
}

export function filterLanguages(langs, query) {
  const q = query.trim().toLowerCase();
  if (!q) return langs;
  return langs.filter(
    (l) =>
      l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q)
  );
}

// Download text as a file
export function downloadAsFile(text, filename, mimeType = "text/plain") {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Debounce helper
export function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
