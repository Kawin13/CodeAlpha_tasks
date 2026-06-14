import { useState, useEffect, useCallback, useRef } from "react";
import { translateText, fetchLanguages } from "../utils/api.js";
import { addHistory } from "../store/storage.js";
import { debounce } from "../utils/languages.js";

const BUILT_IN = [
  { code: "en", name: "English" }, { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },  { code: "de", name: "German" },
  { code: "it", name: "Italian" }, { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" }, { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },{ code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" }, { code: "uk", name: "Ukrainian" },
  { code: "nl", name: "Dutch" },   { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" }, { code: "id", name: "Indonesian" },
  { code: "vi", name: "Vietnamese" },{ code: "th", name: "Thai" },
];

const MAX_CHARS = 2000;
const AUTO_TRANSLATE_DELAY = 1200; // ms

export function useTranslator() {
  const [languages, setLanguages]       = useState(BUILT_IN);
  const [sourceLang, setSourceLang]     = useState("en");
  const [targetLang, setTargetLang]     = useState("es");
  const [inputText, setInputText]       = useState("");
  const [outputText, setOutputText]     = useState("");
  const [provider, setProvider]         = useState(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState(null);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [currentEntry, setCurrentEntry] = useState(null);

  // Load languages once
  useEffect(() => {
    fetchLanguages()
      .then((langs) => {
        if (Array.isArray(langs) && langs.length > 0) {
          setLanguages(langs.filter((l) => l.code && l.name));
        }
      })
      .catch(() => {});
  }, []);

  const doTranslate = useCallback(async (text, source, target) => {
    const trimmed = (text || "").trim();
    if (!trimmed) { setOutputText(""); return; }
    if (trimmed.length > MAX_CHARS) {
      setError(`Text must be ${MAX_CHARS.toLocaleString()} characters or less.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await translateText({ text: trimmed, source, target });
      setOutputText(res.translatedText);
      setProvider(res.provider);
      const entry = {
        id: Date.now(),
        input: trimmed,
        output: res.translatedText,
        source,
        target,
        provider: res.provider,
        cached: res.cached,
        at: new Date().toISOString(),
      };
      setCurrentEntry(entry);
      addHistory(entry);
    } catch (err) {
      setError(err.message || "Translation failed. Please try again.");
      setOutputText("");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-translate with debounce
  const debouncedTranslate = useRef(
    debounce((text, src, tgt) => doTranslate(text, src, tgt), AUTO_TRANSLATE_DELAY)
  ).current;

  useEffect(() => {
    if (!autoTranslate || !inputText.trim()) return;
    debouncedTranslate(inputText, sourceLang, targetLang);
  }, [inputText, sourceLang, targetLang, autoTranslate, debouncedTranslate]);

  const handleTranslate = useCallback(() => {
    doTranslate(inputText, sourceLang, targetLang);
  }, [inputText, sourceLang, targetLang, doTranslate]);

  const handleSwap = useCallback(() => {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  }, [sourceLang, targetLang, inputText, outputText]);

  const clearInput = useCallback(() => {
    setInputText("");
    setOutputText("");
    setError(null);
    setCurrentEntry(null);
    setProvider(null);
  }, []);

  const loadEntry = useCallback((entry) => {
    setInputText(entry.input);
    setOutputText(entry.output);
    setSourceLang(entry.source);
    setTargetLang(entry.target);
    setProvider(entry.provider);
    setCurrentEntry(entry);
    setError(null);
  }, []);

  return {
    languages,
    sourceLang, setSourceLang,
    targetLang, setTargetLang,
    inputText, setInputText,
    outputText,
    provider,
    isLoading,
    error, setError,
    charCount: inputText.length,
    maxChars: MAX_CHARS,
    autoTranslate, setAutoTranslate,
    handleTranslate,
    handleSwap,
    clearInput,
    loadEntry,
    currentEntry,
  };
}
