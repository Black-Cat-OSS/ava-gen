import { useTranslation } from 'react-i18next';
import { Callout } from '../Callout';

/**
 * Fallback component that uses hooks for translations
 */
export const ErrorBoundaryFallback = ({ error }: { error?: Error }) => {
  const { t } = useTranslation();

  return (
    <Callout
      type="error"
      title={t('errorBoundary.title')}
      subtitle={t('errorBoundary.subtitle')}
    >
      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-medium">
          {t('errorBoundary.errorDetails')}
        </summary>
        <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
          {error?.message || t('errorBoundary.unknownError')}
        </pre>
      </details>
    </Callout>
  );
};
