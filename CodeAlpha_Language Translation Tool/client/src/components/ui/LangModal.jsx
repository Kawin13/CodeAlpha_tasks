import { useState, useEffect, useRef } from "react";
import { Search, X, Check } from "lucide-react";
import { getFlag, filterLanguages } from "../../utils/languages.js";

export default function LangModal({ languages, selected, onSelect, onClose, allowAuto = false }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const baseList = allowAuto
    ? [{ code: "auto", name: "Auto Detect" }, ...languages]
    : languages;
  const filtered = filterLanguages(baseList, query);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Select language"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] animate-fade-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--text-subtle)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages…"
            className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder-[var(--text-subtle)] outline-none"
          />
          <button onClick={onClose} className="btn-icon p-1 shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-72 py-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-[var(--text-subtle)] py-6">No languages found</p>
          ) : (
            filtered.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onSelect(lang.code); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                           hover:bg-[var(--surface-raised)] transition-colors text-left"
              >
                <span className="text-xl w-7 text-center" aria-hidden="true">
                  {getFlag(lang.code)}
                </span>
                <span className="flex-1 text-[var(--text)]">{lang.name}</span>
                {lang.code === selected && (
                  <Check size={14} className="text-brand-500 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
