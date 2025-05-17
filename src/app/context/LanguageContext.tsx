"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("language") as Language) || "ar"
  );

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
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
