import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/shared/locales/en.json';
import ru from '@/shared/locales/ru.json';
import es from '@/shared/locales/es.json';
import de from '@/shared/locales/de.json';
import et from '@/shared/locales/et.json';

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
  es: {
    translation: es,
  },
  de: {
    translation: de,
  },
  et: {
    translation: et,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
