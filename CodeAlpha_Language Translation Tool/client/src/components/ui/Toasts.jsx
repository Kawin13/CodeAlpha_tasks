import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />,
  error:   <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />,
  info:    <Info        size={15} className="text-brand-400 shrink-0 mt-0.5" />,
};

export default function Toasts({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-up flex items-start gap-3 px-4 py-3 rounded-xl
                     card shadow-xl shadow-black/10"
        >
          {ICONS[t.type] ?? ICONS.info}
          <p className="text-sm text-[var(--text)] flex-1 leading-snug">{t.message}</p>
          <button onClick={() => onRemove(t.id)} className="btn-icon p-0.5 shrink-0">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
