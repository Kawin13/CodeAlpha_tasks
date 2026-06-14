export default function Hero() {
  return (
    <div className="relative text-center py-8 sm:py-12 overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[260px] rounded-full bg-brand-500/8 blur-3xl pointer-events-none" />

      <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[3.5rem] text-[var(--text)] tracking-tight leading-tight mb-4">
        AI Language{" "}
        <span className="relative inline-block">
          <span className="relative z-10 text-brand-500">Translator</span>
          <span className="absolute inset-x-0 bottom-1 h-2.5 bg-brand-500/12 rounded -rotate-1" />
        </span>
      </h1>

      <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        Translate text instantly across multiple languages with fast and reliable AI-powered translation.
      </p>
    </div>
  );
}
