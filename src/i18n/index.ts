import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import ar from './locales/ar.json';
import en from './locales/en.json';

const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
  en: { translation: en },
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('mystyle_lang') : null;
const initialLang = savedLang || 'fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'mystyle_lang',
      caches: ['localStorage'],
    },
  });

export function applyLanguageSettings(lang: string) {
  const isRtl = lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  localStorage.setItem('mystyle_lang', lang);
}

// Initial sync
applyLanguageSettings(i18n.language || initialLang);

// Listen to language changes
i18n.on('languageChanged', (lng) => {
  applyLanguageSettings(lng);
});

export default i18n;
