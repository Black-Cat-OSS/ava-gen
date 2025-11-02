import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nResources } from 'virtual:i18n-resources';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: i18nResources,
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

// HMR поддержка для переводов
if (import.meta.hot) {
  import.meta.hot.accept('virtual:i18n-resources', async (newModule) => {
    if (newModule) {
      // Получаем текущий язык
      const currentLanguage = i18n.language;
      
      // Обновляем ресурсы
      Object.keys(newModule.i18nResources).forEach((lang) => {
        Object.keys(newModule.i18nResources[lang]).forEach((namespace) => {
          i18n.addResourceBundle(
            lang,
            namespace,
            newModule.i18nResources[lang][namespace],
            true,
            true
          );
        });
      });
      
      // Перезагружаем текущий язык
      await i18n.changeLanguage(currentLanguage);
      
      console.log('🔥 HMR: Переводы обновлены в i18n');
    }
  });
}

export default i18n;
