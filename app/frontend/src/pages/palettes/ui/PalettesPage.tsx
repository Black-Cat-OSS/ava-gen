import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/shared/ui';
import { PalettesSkeleton } from './Skeleton';
import { useTranslation } from 'react-i18next';

/**
 * Страница управления палитрами
 * Отображает все доступные цветовые палитры с возможностью просмотра и удаления
 * Использует React Query Suspense для декларативного управления загрузкой и ошибками
 */
const PalletesGrid = lazy(() => import('./PalletesGrid'));

export const PalettesPage = () => {
  const { t } = useTranslation('pagesPalettes');

  return (
    <>
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold text-center">{t('title')}</h1>
      </div>
      <ErrorBoundary
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-500">{t('errorMessage')}</div>
          </div>
        }
      >
        <Suspense fallback={<PalettesSkeleton />}>
          <PalletesGrid />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
