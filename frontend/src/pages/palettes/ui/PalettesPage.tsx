import { Suspense } from 'react';
import { ErrorBoundary } from '@/shared/ui';
import { PalletesGrid } from './PalletesGrid';

/**
 * Страница управления палитрами
 * Отображает все доступные цветовые палитры с возможностью просмотра и удаления
 * Использует React Query Suspense для декларативного управления загрузкой и ошибками
 */
export const PalettesPage = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            Error loading palettes. Please try again later.
          </div>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading palettes...</div>
          </div>
        }
      >
        <PalletesGrid />
      </Suspense>
    </ErrorBoundary>
  );
};
