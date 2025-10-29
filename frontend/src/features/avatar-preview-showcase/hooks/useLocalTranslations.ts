import { useLocalTranslations as useLocalTranslationsBase } from '@/shared/lib/hooks';
import { avatarPreviewShowcaseTranslations } from '../locales';

/**
 * Hook for managing local translations for avatar preview showcase feature
 * Automatically loads and updates translations when language changes
 */
export const useLocalTranslations = () => {
  return useLocalTranslationsBase('avatarPreviewShowcase', avatarPreviewShowcaseTranslations);
};
