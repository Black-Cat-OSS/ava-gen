import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/shared/lib/utils/i18n';
//TODO: make loading dynamiclly
//TODO: later make plugin for compilation
import { avatarPreviewShowcaseTranslations } from '../locales';

/**
 * Hook for managing local translations for avatar preview showcase feature
 * Automatically loads and updates translations when language changes
 */
export const useLocalTranslations = () => {
  const { t } = useTranslation('avatarPreviewShowcase');

  useEffect(() => {
    const loadTranslations = (language: string) => {
      const translations =
        avatarPreviewShowcaseTranslations[
          language as keyof typeof avatarPreviewShowcaseTranslations
        ];

      if (translations) {
        i18n.addResourceBundle(language, 'avatarPreviewShowcase', translations, true, true);
      }
    };

    // Load translations for current language immediately
    loadTranslations(i18n.language);

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      loadTranslations(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return { t };
};
