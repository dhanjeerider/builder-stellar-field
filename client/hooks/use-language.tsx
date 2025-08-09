import { createContext, useContext, useEffect, useState } from "react";

export interface Language {
  code: string;
  name: string;
  flag: string;
  region?: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", region: "IN" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: string;
  storageKey?: string;
};

type LanguageProviderState = {
  language: string;
  languageData: Language;
  setLanguage: (language: string) => void;
  getDiscoverParams: () => { with_original_language?: string; region?: string };
};

const initialState: LanguageProviderState = {
  language: "en",
  languageData: LANGUAGES[0],
  setLanguage: () => null,
  getDiscoverParams: () => ({}),
};

const LanguageProviderContext =
  createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "moviestream-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<string>(
    () => (localStorage.getItem(storageKey) as string) || defaultLanguage,
  );

  useEffect(() => {
    localStorage.setItem(storageKey, language);
  }, [language, storageKey]);

  const languageData =
    LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[0];

  const getDiscoverParams = () => {
    const params: { with_original_language?: string; region?: string } = {};

    if (language !== "en") {
      params.with_original_language = language;
      if (languageData.region) {
        params.region = languageData.region;
      }
    }

    return params;
  };

  const value = {
    language,
    languageData,
    setLanguage: (language: string) => {
      setLanguage(language);
    },
    getDiscoverParams,
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};
