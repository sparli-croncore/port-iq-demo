"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  setLanguageDirect: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "ar";
    }
    return "ar"; // Default fallback on SSR
  });

  const applyLanguageSettings = (lang: Language) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    applyLanguageSettings(newLang);
  };

  const setLanguageDirect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    applyLanguageSettings(lang);
  };

  useEffect(() => {
    applyLanguageSettings(language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguageDirect }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
