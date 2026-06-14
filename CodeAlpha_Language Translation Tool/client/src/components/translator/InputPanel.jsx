import { useRef } from "react";
import { Mic, MicOff, X, Keyboard } from "lucide-react";

export default function InputPanel({
  value, onChange, onClear,
  charCount, maxChars,
  isListening, onStartListen, onStopListen, hasSTT,
  autoTranslate, onToggleAuto,
}) {
  const textareaRef = useRef(null);
  const nearLimit = charCount > maxChars * 0.8;
  const atLimit   = charCount >= maxChars;

  return (
    <div className="card flex flex-col h-full min-h-[260px] overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-widest">
          Source Text
        </span>
        <div className="flex items-center gap-1">
          {/* Auto-translate toggle */}
          <button
            onClick={onToggleAuto}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150
              ${autoTranslate
                ? "bg-brand-500/12 text-brand-500 border border-brand-500/20"
                : "text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)] border border-transparent"
              }`}
            title={autoTranslate ? "Auto-translate on" : "Auto-translate off"}
          >
            <Keyboard size={12} />
            <span className="hidden sm:inline">Auto</span>
          </button>

          {/* Voice input */}
          {hasSTT && (
            <button
              onClick={isListening ? onStopListen : onStartListen}
              className={`btn-icon transition-all duration-150 ${isListening ? "text-red-400 bg-red-500/10 rounded-lg" : ""}`}
              title={isListening ? "Stop listening" : "Voice input"}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
          )}

          {/* Clear */}
          {value && (
            <button
              onClick={onClear}
              className="btn-icon"
              aria-label="Clear text"
              title="Clear"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Listening indicator */}
      {isListening && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/8 border border-red-500/15">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 font-medium">Listening…</span>
        </div>
      )}

      {/* Textarea */}
      <div className="flex-1 px-4 py-3">
        <textarea
          ref={textareaRef}
          className="textarea-core h-full min-h-[160px]"
          placeholder="Type, paste or speak text to translate…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxChars}
          aria-label="Text to translate"
          spellCheck
        />
      </div>

      {/* Bottom — char counter */}
      <div className="px-4 pb-3 flex justify-end">
        <span className={`text-xs font-mono tabular-nums transition-colors duration-150
          ${atLimit ? "text-red-400 font-semibold" : nearLimit ? "text-amber-500" : "text-[var(--text-subtle)]"}`}>
          {charCount.toLocaleString()} / {maxChars.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
