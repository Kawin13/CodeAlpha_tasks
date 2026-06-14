import { useState, useEffect } from "react";
import { Star, X, ArrowRight, Trash2 } from "lucide-react";
import { getFavorites, toggleFavorite } from "../../store/storage.js";
import { getFlag } from "../../utils/languages.js";

export default function FavoritesDrawer({ open, onClose, onLoad, languages }) {
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    if (open) setFavs(getFavorites());
  }, [open]);

  const handleRemove = (entry) => {
    toggleFavorite(entry);
    setFavs((p) => p.filter((f) => f.id !== entry.id));
  };

  const getName = (code) => languages.find((l) => l.code === code)?.name ?? code;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-sm bg-[var(--surface)] border-l border-[var(--border)] flex flex-col animate-fade-in shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-400" fill="currentColor" />
            <span className="font-semibold text-sm text-[var(--text)]">Favorites</span>
            <span className="text-xs text-[var(--text-subtle)] bg-[var(--surface-raised)] px-1.5 py-0.5 rounded-full">
              {favs.length}
            </span>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {favs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Star size={28} className="text-[var(--text-subtle)] mb-2 opacity-40" />
              <p className="text-sm text-[var(--text-subtle)]">No favorites yet</p>
              <p className="text-xs text-[var(--text-subtle)] mt-1">Star a translation to save it here</p>
            </div>
          ) : (
            favs.map((entry) => (
              <div key={entry.id} className="group relative mb-1">
                <button
                  onClick={() => { onLoad(entry); onClose(); }}
                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-[var(--surface-raised)]
                             transition-colors border border-transparent hover:border-[var(--border)] pr-10"
                >
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] mb-1.5">
                    <span>{getFlag(entry.source)} {getName(entry.source)}</span>
                    <ArrowRight size={10} />
                    <span>{getFlag(entry.target)} {getName(entry.target)}</span>
                  </div>
                  <p className="text-sm text-[var(--text)] line-clamp-1 font-medium">{entry.input}</p>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">{entry.output}</p>
                </button>
                <button
                  onClick={() => handleRemove(entry)}
                  className="absolute top-3 right-2 btn-icon opacity-0 group-hover:opacity-100 text-red-400"
                  title="Remove favorite"
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
