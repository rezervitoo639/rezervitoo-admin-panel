import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import arTranslation from "./locales/ar/translation.json";
import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";

// Language detection configuration
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "urlPath",
  lookup() {
    const pathParts = window.location.pathname.split("/");
    // Check if first segment after root is a valid language code
    const langCode = pathParts[1];
    if (["ar", "en", "fr"].includes(langCode)) {
      return langCode;
    }
    return undefined;
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem("rezervitoo_language", lng);
  },
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslation,
      },
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
    },
    fallbackLng: "ar",
    defaultNS: "translation",

    detection: {
      order: ["urlPath", "localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "rezervitoo_language",
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense for better control
    },
  });

export default i18n;
