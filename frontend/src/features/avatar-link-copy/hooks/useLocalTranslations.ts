import { useLocalTranslations as useLocalTranslationsBase } from '@/shared/lib/hooks';
import { avatarLinkCopyTranslations } from '../locales';

/**
 * Hook for managing local translations for avatar link copy feature
 * Automatically loads and updates translations when language changes
 */
export const useLocalTranslations = () => {
  return useLocalTranslationsBase('avatarLinkCopy', avatarLinkCopyTranslations);
};
