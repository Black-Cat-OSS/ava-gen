import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/shared/lib/utils/i18n';

/**
 * Generic hook for managing local translations for features
 * Automatically loads and updates translations when language changes
 * 
 * @param namespace - The i18n namespace for the translations
 * @param translations - Object containing translations for different languages
 * @returns Object with translation function
 * 
 * @example
 * ```tsx
 * const translations = {
 *   en: { key: 'value' },
 *   ru: { key: 'значение' }
 * };
 * 
 * const { t } = useLocalTranslations('myFeature', translations);
 * ```
 */
export const useLocalTranslations = <T extends Record<string, unknown>>(
  namespace: string,
  translations: Record<string, T>
) => {
  const { t } = useTranslation(namespace);

  useEffect(() => {
    const loadTranslations = (language: string) => {
      const translation = translations[language as keyof typeof translations];

      if (translation) {
        i18n.addResourceBundle(language, namespace, translation, true, true);
      }
    };

    loadTranslations(i18n.language);

    const handleLanguageChange = (lng: string) => {
      loadTranslations(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [namespace, translations]);

  return { t };
};

