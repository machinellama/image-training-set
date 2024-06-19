import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './english.js';
import jaTranslations from './japanese.js';
import esTranslations from './spanish.js';
import koTranslations from './korean.js';
import zhTranslations from './chinese.js';

const resources = {
  en: enTranslations,
  ja: jaTranslations,
  es: esTranslations,
  ko: koTranslations,
  zh: zhTranslations
};

i18n.use(initReactI18next).init({
  supportedLngs: ['en', 'ja', 'es', 'ko', 'zh'],
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
