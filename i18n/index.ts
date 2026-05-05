import i18n from 'i18next';
import { initReactI18next, useTranslation as useTranslationBase } from 'react-i18next';
import * as Localization from 'expo-localization';

import es from './es.json';
import it from './it.json';
import en from './en.json';

// ---------------------------------------------------------------------------
// Supported languages
// ---------------------------------------------------------------------------
export const SUPPORTED_LANGUAGES = ['es', 'it', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// ---------------------------------------------------------------------------
// Detect device language and map to a supported language
// ---------------------------------------------------------------------------
function getInitialLanguage(): SupportedLanguage {
  const deviceLocales = Localization.getLocales();
  for (const locale of deviceLocales) {
    const lang = locale.languageCode?.toLowerCase();
    if (lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
      return lang as SupportedLanguage;
    }
  }
  return 'es'; // default
}

// ---------------------------------------------------------------------------
// i18next init
// ---------------------------------------------------------------------------
i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      it: { translation: it },
      en: { translation: en },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    compatibilityJSON: 'v3',
  });

export default i18n;

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

/** Imperative translation function — use inside non-component code */
export const t = i18n.t.bind(i18n);

/** React hook for translations (re-exported for convenience) */
export { useTranslationBase as useTranslation };

/** Change the active language at runtime */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lang);
}
