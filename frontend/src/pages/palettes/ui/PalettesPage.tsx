import { lazy, Suspense, useState } from 'react';
import { Button, ErrorBoundary } from '@/shared/ui';
import { PalettesSkeleton } from './Skeleton';
import { usePalletes, useLocalTranslations } from '@/shared/lib/hooks';
import { palettesTranslations } from '../locales/translations';

/**
 * Страница управления палитрами
 * Отображает все доступные цветовые палитры с возможностью просмотра и удаления
 * Использует React Query Suspense для декларативного управления загрузкой и ошибками
 */
const PalletesGrid = lazy(() => import('./PalletesGrid'));

export const PalettesPage = () => {
  const [chunk, setChunk] = useState<number>(1);
  const { t } = useLocalTranslations('palettes', palettesTranslations);

  const { data } = usePalletes({ pick: 10 * chunk, offset: 0 });

  const handleLoadMore = () => {
    setChunk(prev => prev + 1);
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{t('errorMessage')}</div>
        </div>
      }
    >
      <Suspense fallback={<PalettesSkeleton />}>
        {data && (
          <>
            <PalletesGrid data={data} title={t('title')} />
            <div className="flex justify-center">
              <Button onClick={handleLoadMore} disabled={!data?.pagination.hasMore}>
                {t('loadMore')}
              </Button>
            </div>
          </>
        )}
      </Suspense>
    </ErrorBoundary>
  );
};
