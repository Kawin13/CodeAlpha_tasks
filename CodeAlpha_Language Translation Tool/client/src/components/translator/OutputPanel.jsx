import { useState, useCallback } from "react";
import { Copy, Volume2, VolumeX, Download, Star, Share2, Check } from "lucide-react";
import { downloadAsFile } from "../../utils/languages.js";
import { toggleFavorite, isFavorite } from "../../store/storage.js";

export default function OutputPanel({
  text, isLoading, targetLang,
  currentEntry, onToast,
  isSpeaking, onSpeak, onStopSpeak, hasTTS,
}) {
  const [copied, setCopied] = useState(false);
  const [starred, setStarred] = useState(() => currentEntry ? isFavorite(currentEntry.id) : false);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onToast("Copied to clipboard", "success");
    } catch {
      onToast("Could not copy — try selecting manually", "error");
    }
  }, [text, onToast]);

  const handleDownload = useCallback(() => {
    if (!text) return;
    downloadAsFile(text, `translation-${targetLang}.txt`);
    onToast("Downloaded", "success");
  }, [text, targetLang, onToast]);

  const handleShare = useCallback(async () => {
    if (!text) return;
    if (navigator.share) {
      try { await navigator.share({ title: "Translation", text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    onToast("Translation copied", "info");
  }, [text, onToast]);

  const handleStar = useCallback(() => {
    if (!currentEntry) return;
    const added = toggleFavorite(currentEntry);
    setStarred(added);
    onToast(added ? "Added to favorites" : "Removed from favorites", "success");
  }, [currentEntry, onToast]);

  return (
    <div className="card flex flex-col h-full min-h-[240px] overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-widest">
          Translation
        </span>
        <div className="flex items-center gap-0.5">
          {hasTTS && (
            <button
              onClick={isSpeaking ? onStopSpeak : () => onSpeak(text, targetLang)}
              disabled={!text || isLoading}
              className={`btn-icon transition-colors ${isSpeaking ? "text-brand-400" : ""}`}
              title={isSpeaking ? "Stop" : "Listen"}
              aria-label={isSpeaking ? "Stop speech" : "Read aloud"}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
          <button
            onClick={handleStar}
            disabled={!currentEntry}
            className={`btn-icon transition-colors ${starred ? "text-amber-400" : ""}`}
            title="Favorite"
          >
            <Star size={15} fill={starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!text || isLoading}
            className={`btn-icon transition-colors ${copied ? "text-emerald-500" : ""}`}
            title="Copy"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <button onClick={handleDownload} disabled={!text || isLoading} className="btn-icon" title="Download TXT">
            <Download size={15} />
          </button>
          <button onClick={handleShare} disabled={!text || isLoading} className="btn-icon" title="Share">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 pt-1">
            <div className="shimmer h-4 rounded-lg w-3/4" />
            <div className="shimmer h-4 rounded-lg w-full" />
            <div className="shimmer h-4 rounded-lg w-2/3" />
            <div className="shimmer h-4 rounded-lg w-5/6" />
          </div>
        ) : text ? (
          <p className="text-base leading-relaxed text-[var(--text)] animate-fade-in whitespace-pre-wrap">
            {text}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-subtle)] italic pt-1">
            Translation will appear here…
          </p>
        )}
      </div>

      {/* Bottom */}
      {text && !isLoading && (
        <div className="px-4 pb-3 flex justify-end">
          <span className="text-xs font-mono text-[var(--text-subtle)] tabular-nums">
            {text.length.toLocaleString()} chars
          </span>
        </div>
      )}
    </div>
  );
}
