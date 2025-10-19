import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui';

/**
 * Error fallback component for ErrorBoundary
 * Displays error message when color palette loading fails
 */
export const ColorPaletteError = () => {
  const { t } = useTranslation();

  return (
    <Callout
      type="error"
      title={t('features.avatarGenerator.colorPaletteError.title')}
      subtitle={t('features.avatarGenerator.colorPaletteError.subtitle')}
    >
      <p className="text-sm">
        {t('features.avatarGenerator.colorPaletteError.description')}
      </p>
    </Callout>
  );
};
