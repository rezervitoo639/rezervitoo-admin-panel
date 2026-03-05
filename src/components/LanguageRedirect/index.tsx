import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import i18n from "../../i18n/config";

const SUPPORTED_LANGUAGES = ["ar", "en", "fr"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * LanguageRedirect component ensures all routes have a language prefix
 * If no language is detected in the URL, it redirects to the default language
 */
export function LanguageRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const firstSegment = pathParts[0] as SupportedLanguage;

    // If no language prefix in URL, redirect to default language
    if (!SUPPORTED_LANGUAGES.includes(firstSegment)) {
      const detectedLanguage = i18n.language || "ar";
      const validLanguage = SUPPORTED_LANGUAGES.includes(
        detectedLanguage as SupportedLanguage,
      )
        ? detectedLanguage
        : "ar";

      const newPath = `/${validLanguage}${location.pathname}${location.search}${location.hash}`;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

/**
 * Hook to get the current language from the URL
 */
export function useLanguageFromUrl(): SupportedLanguage {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const langFromUrl = pathParts[0] as SupportedLanguage;

  if (SUPPORTED_LANGUAGES.includes(langFromUrl)) {
    return langFromUrl;
  }

  return "ar"; // Default fallback
}

/**
 * Hook to navigate with language prefix
 */
export function useLanguageNavigate() {
  const navigate = useNavigate();
  const currentLang = useLanguageFromUrl();

  return (path: string, options?: { replace?: boolean }) => {
    const newPath = path.startsWith("/")
      ? `/${currentLang}${path}`
      : `/${currentLang}/${path}`;
    navigate(newPath, options);
  };
}
