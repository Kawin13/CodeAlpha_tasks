import { useState, useEffect } from "react";
import { Clock, Trash2, X, ArrowRight } from "lucide-react";
import { getHistory, clearHistory } from "../../store/storage.js";
import { getFlag } from "../../utils/languages.js";

export default function HistoryDrawer({ open, onClose, onLoad, languages }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open) setHistory(getHistory());
  }, [open]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const getName = (code) => languages.find((l) => l.code === code)?.name ?? code;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-sm bg-[var(--surface)] border-l border-[var(--border)] flex flex-col animate-fade-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brand-400" />
            <span className="font-semibold text-sm text-[var(--text)]">History</span>
            <span className="text-xs text-[var(--text-subtle)] bg-[var(--surface-raised)] px-1.5 py-0.5 rounded-full">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button onClick={handleClear} className="btn-icon text-red-400" title="Clear all">
                <Trash2 size={15} />
              </button>
            )}
            <button onClick={onClose} className="btn-icon"><X size={16} /></button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Clock size={28} className="text-[var(--text-subtle)] mb-2 opacity-40" />
              <p className="text-sm text-[var(--text-subtle)]">No translations yet</p>
            </div>
          ) : (
            history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => { onLoad(entry); onClose(); }}
                className="w-full text-left px-3 py-3 rounded-xl hover:bg-[var(--surface-raised)]
                           transition-colors border border-transparent hover:border-[var(--border)] mb-1"
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] mb-1.5">
                  <span>{getFlag(entry.source)} {getName(entry.source)}</span>
                  <ArrowRight size={10} />
                  <span>{getFlag(entry.target)} {getName(entry.target)}</span>
                  <span className="ml-auto tabular-nums">
                    {new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm text-[var(--text)] line-clamp-1 font-medium">{entry.input}</p>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">{entry.output}</p>
              </button>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
