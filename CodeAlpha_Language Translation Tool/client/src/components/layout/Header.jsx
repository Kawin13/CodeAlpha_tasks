import { useState, useEffect } from "react";
import { Sun, Moon, Globe, Wifi, WifiOff, Menu, X } from "lucide-react";

export default function Header({ isDark, onToggle, onOpenHistory, onOpenFavorites }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const StatusBadge = () => (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium
      ${isOnline
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
      {isOnline ? "Online" : "Offline"}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface-overlay)] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/25">
            <Globe size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-[var(--text)]">
            Global<span className="text-brand-500">Translator</span>
          </span>
        </div>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-3">
          <StatusBadge />

          <div className="w-px h-4 bg-[var(--border)]" />

          <button onClick={onOpenHistory}   className="btn-ghost text-xs font-medium px-3 py-2">History</button>
          <button onClick={onOpenFavorites} className="btn-ghost text-xs font-medium px-3 py-2">Favorites</button>

          <button onClick={onToggle} className="btn-icon" aria-label="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden btn-icon"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex flex-col gap-1">
          <div className="px-2 py-2">
            <StatusBadge />
          </div>
          <button onClick={() => { onOpenHistory();   setMobileOpen(false); }}
            className="btn-ghost justify-start text-sm w-full">History</button>
          <button onClick={() => { onOpenFavorites(); setMobileOpen(false); }}
            className="btn-ghost justify-start text-sm w-full">Favorites</button>
          <button onClick={onToggle} className="btn-ghost justify-start text-sm w-full gap-2">
            {isDark ? <><Sun size={15} /> Light mode</> : <><Moon size={15} /> Dark mode</>}
          </button>
        </div>
      )}
    </header>
  );
}
