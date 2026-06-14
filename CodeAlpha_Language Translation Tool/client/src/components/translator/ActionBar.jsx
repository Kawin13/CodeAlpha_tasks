import { Languages, AlertTriangle, X } from "lucide-react";
import Spinner from "../ui/Spinner.jsx";

export default function ActionBar({ onTranslate, isLoading, disabled, error, onDismissError }) {
  return (
    <div className="space-y-3">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl
                        bg-red-500/6 border border-red-500/15 animate-fade-in">
          <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-400 flex-1 leading-snug">{error}</p>
          <button
            onClick={onDismissError}
            className="btn-icon p-0.5 text-red-400 hover:text-red-300 shrink-0"
            aria-label="Dismiss error"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Button row */}
      <div className="flex items-center justify-between gap-4">
        <p className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-subtle)]">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-muted)]">
            ⌘
          </kbd>
          {" + "}
          <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-muted)]">
            ↵
          </kbd>
          {" to translate"}
        </p>

        <button
          onClick={onTranslate}
          disabled={disabled || isLoading}
          className="btn-primary ml-auto min-w-[140px] justify-center"
          aria-label="Translate"
        >
          {isLoading
            ? <><Spinner size={16} /> Translating…</>
            : <><Languages size={16} /> Translate</>
          }
        </button>
      </div>
    </div>
  );
}
