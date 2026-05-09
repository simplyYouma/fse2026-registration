"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Lang, type TKey } from "./i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("fse_lang")) as Lang | null;
    if (stored === "fr" || stored === "en") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("fse_lang", l);
  }

  const t = (k: TKey) => translations[lang][k] ?? translations.en[k] ?? k;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium ${className}`}>
      <button type="button" onClick={() => setLang("fr")}
        className={`px-3 py-1 rounded-full transition ${lang === "fr" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
        FR
      </button>
      <button type="button" onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full transition ${lang === "en" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
        EN
      </button>
    </div>
  );
}
