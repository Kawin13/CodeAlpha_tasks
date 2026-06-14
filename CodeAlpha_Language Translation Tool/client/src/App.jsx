import { useCallback, useEffect, useState } from "react";

// Layout
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

// Translator
import Hero from "./components/translator/Hero.jsx";
import LanguageBar from "./components/translator/LanguageBar.jsx";
import InputPanel from "./components/translator/InputPanel.jsx";
import OutputPanel from "./components/translator/OutputPanel.jsx";
import ActionBar from "./components/translator/ActionBar.jsx";
import HistoryDrawer from "./components/translator/HistoryDrawer.jsx";
import FavoritesDrawer from "./components/translator/FavoritesDrawer.jsx";

// UI
import Toasts from "./components/ui/Toasts.jsx";

// Hooks
import { useTheme } from "./hooks/useTheme.js";
import { useToast } from "./hooks/useToast.js";
import { useTranslator } from "./hooks/useTranslator.js";
import { useSpeech } from "./hooks/useSpeech.js";

export default function App() {
  const { isDark, toggle } = useTheme();
  const { toasts, toast, remove } = useToast();
  const speech = useSpeech();

  const {
    languages,
    sourceLang, setSourceLang,
    targetLang, setTargetLang,
    inputText, setInputText,
    outputText,
    isLoading,
    error, setError,
    charCount, maxChars,
    autoTranslate, setAutoTranslate,
    handleTranslate,
    handleSwap,
    clearInput,
    loadEntry,
    currentEntry,
  } = useTranslator();

  const [historyOpen,   setHistoryOpen]   = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleTranslate();
      }
      if (e.key === "Escape") {
        setHistoryOpen(false);
        setFavoritesOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTranslate]);

  const handleSpeak = useCallback(
    (text, lang) => speech.speak(text, lang),
    [speech]
  );

  const handleStartListen = useCallback(() => {
    speech.startListening(sourceLang, (transcript) => {
      setInputText((prev) => prev ? `${prev} ${transcript}` : transcript);
    });
  }, [sourceLang, speech, setInputText]);

  return (
    <div className="min-h-dvh flex flex-col relative overflow-x-hidden">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "var(--bg-grid)" }}
        aria-hidden="true"
      />

      <Header
        isDark={isDark}
        onToggle={toggle}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      <main className="relative flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12 flex flex-col gap-6">
        <Hero />

        {/* Language selector */}
        <LanguageBar
          languages={languages}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSourceChange={setSourceLang}
          onTargetChange={setTargetLang}
          onSwap={handleSwap}
        />

        {/* Translation panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputPanel
            value={inputText}
            onChange={setInputText}
            onClear={clearInput}
            charCount={charCount}
            maxChars={maxChars}
            isListening={speech.isListening}
            onStartListen={handleStartListen}
            onStopListen={speech.stopListening}
            hasSTT={speech.hasSTT}
            autoTranslate={autoTranslate}
            onToggleAuto={() => setAutoTranslate((p) => !p)}
          />
          <OutputPanel
            text={outputText}
            isLoading={isLoading}
            targetLang={targetLang}
            currentEntry={currentEntry}
            onToast={toast}
            isSpeaking={speech.isSpeaking}
            onSpeak={handleSpeak}
            onStopSpeak={speech.stopSpeaking}
            hasTTS={speech.hasTTS}
          />
        </div>

        {/* Action bar */}
        <ActionBar
          onTranslate={handleTranslate}
          isLoading={isLoading}
          disabled={!inputText.trim() || charCount > maxChars}
          error={error}
          onDismissError={() => setError(null)}
        />
      </main>

      <Footer />

      {/* Drawers */}
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoad={loadEntry}
        languages={languages}
      />
      <FavoritesDrawer
        open={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        onLoad={loadEntry}
        languages={languages}
      />

      <Toasts toasts={toasts} onRemove={remove} />
    </div>
  );
}
