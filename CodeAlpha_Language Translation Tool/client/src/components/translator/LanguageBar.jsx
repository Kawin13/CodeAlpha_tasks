import { useState } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { getFlag } from "../../utils/languages.js";
import LangModal from "../ui/LangModal.jsx";

function LangButton({ code, name, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center gap-3 px-4 py-3
                 bg-[var(--surface-raised)] hover:bg-[var(--border)]
                 border border-[var(--border)] hover:border-brand-500/30
                 rounded-xl transition-all duration-150 text-left min-w-0 group
                 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none"
      aria-label={`Select ${label} language: currently ${name}`}
    >
      <span className="text-2xl shrink-0 leading-none" aria-hidden="true">
        {getFlag(code)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-widest mb-0.5">
          {label}
        </div>
        <div className="text-sm font-semibold text-[var(--text)] truncate leading-tight">
          {name}
        </div>
      </div>
      <ChevronDown
        size={14}
        className="text-[var(--text-subtle)] shrink-0 group-hover:text-brand-500 transition-colors duration-150"
      />
    </button>
  );
}

export default function LanguageBar({ languages, sourceLang, targetLang, onSourceChange, onTargetChange, onSwap }) {
  const [modal, setModal] = useState(null);

  const sourceName = sourceLang === "auto"
    ? "Auto Detect"
    : (languages.find((l) => l.code === sourceLang)?.name ?? sourceLang);
  const targetName = languages.find((l) => l.code === targetLang)?.name ?? targetLang;

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3">
        <LangButton
          code={sourceLang}
          name={sourceName}
          onClick={() => setModal("source")}
          label="From"
        />

        <button
          onClick={onSwap}
          disabled={sourceLang === "auto"}
          className="btn-secondary p-3 shrink-0 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Swap languages"
          title="Swap languages"
        >
          <ArrowLeftRight size={16} />
        </button>

        <LangButton
          code={targetLang}
          name={targetName}
          onClick={() => setModal("target")}
          label="To"
        />
      </div>

      {modal === "source" && (
        <LangModal
          languages={languages}
          selected={sourceLang}
          onSelect={onSourceChange}
          onClose={() => setModal(null)}
          allowAuto
        />
      )}
      {modal === "target" && (
        <LangModal
          languages={languages}
          selected={targetLang}
          onSelect={onTargetChange}
          onClose={() => setModal(null)}
          allowAuto={false}
        />
      )}
    </>
  );
}
