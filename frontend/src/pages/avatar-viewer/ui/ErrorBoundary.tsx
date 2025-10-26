import { t } from "i18next";

interface ErrorBoundaryProps {
  error: Error;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error }) => {
  return (
    <div className="text-center py-8">
        <p className="text-red-500">
          {t('pages.avatarViewer.error')}:{' '}
          {error instanceof Error ? error.message : t('pages.avatarViewer.unknownError')}
        </p>
    </div>
  );
};