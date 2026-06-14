import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export default function Footer() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return (
    <footer className="mt-auto">
      {/* Main footer body */}
      <div className="border-t border-[var(--border)] bg-[var(--surface-overlay)] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">

            {/* Left — brand */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm shadow-brand-500/20">
                  <Globe size={13} className="text-white" />
                </div>
                <span className="font-display font-bold text-sm text-[var(--text)]">
                  Global<span className="text-brand-500">Translator</span>
                </span>
              </div>
              <p className="text-xs text-[var(--text-subtle)] leading-relaxed max-w-[200px]">
                Fast, simple and reliable AI-powered translation.
              </p>
            </div>

            {/* Center — nav links */}
            <div className="flex flex-col gap-2.5 sm:items-center">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1">
                Quick Links
              </p>
              {["Translate", "Languages", "Support"].map((label) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-[var(--text-subtle)] hover:text-brand-500 transition-colors duration-150"
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Right — version + status */}
            <div className="flex flex-col gap-3 sm:items-end">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                               bg-brand-500/10 border border-brand-500/20
                               text-xs font-semibold text-brand-400">
                v2.0.0
              </span>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium
                ${isOnline
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center">
            <p className="text-xs text-[var(--text-subtle)]">
              © 2026 GlobalTranslator. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
