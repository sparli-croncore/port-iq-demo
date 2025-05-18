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
  const [language, setLanguage] = useState<Language>("ar"); // Always start with 'ar'

  const applyLanguageSettings = (lang: Language) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    // On mount, force language to 'ar' and clear any previous language setting
    if (typeof window !== "undefined") {
      localStorage.setItem("language", "ar"); // Reset localStorage to 'ar'
      setLanguage("ar");
      applyLanguageSettings("ar");
    }
  }, []); // Empty dependency array to run only on mount

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang); // Save new language
    }
    applyLanguageSettings(newLang);
  };

  const setLanguageDirect = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
    applyLanguageSettings(lang);
  };

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
