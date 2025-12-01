import { lazy, Suspense } from 'react';
import { Button, ErrorBoundary } from '@/shared/ui';
import { PalettesSkeleton } from './Skeleton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';

/**
 * Страница управления палитрами
 * Отображает все доступные цветовые палитры с возможностью просмотра и удаления
 * Использует React Query Suspense для декларативного управления загрузкой и ошибками
 */
const PalletesGrid = lazy(() => import('./PalletesGrid'));

export const PalettesPage = () => {
  const { t } = useTranslation('pagesPalettes');
  const navigate = useNavigate();

  const handleCreatePalette = () => {
    navigate({ to: '/palettes-add' });
  };

  return (
    <>
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold text-center">{t('title')}</h1>
      </div>
      <div className="container mx-auto px-4 mb-6">
        <Button onClick={handleCreatePalette} variant="default">
          {t('createPalette')}
        </Button>
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
