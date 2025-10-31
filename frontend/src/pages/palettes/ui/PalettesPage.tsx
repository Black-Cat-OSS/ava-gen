import { Suspense } from 'react';
import { useInfinitePalettes, useDeletePalette } from '@/features/color-palette/hooks';
import { ErrorBoundary } from '@/shared/ui';

/**
 * Внутренний компонент страницы с палитрами
 */
const PalettesContent = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePalettes();

  const deletePalette = useDeletePalette();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this palette?')) {
      return;
    }

    try {
      await deletePalette.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete palette');
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allPalettes = data.pages.flatMap((page) => page.palettes);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Color Palettes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPalettes.map((palette) => (
          <div
            key={palette.id}
            className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{palette.name}</h3>
              <button
                onClick={() => handleDelete(palette.id)}
                disabled={deletePalette.isPending}
                className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletePalette.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div
                  className="h-12 rounded-md mb-2"
                  style={{ backgroundColor: palette.primaryColor }}
                />
                <p className="text-sm text-gray-600">Primary: {palette.primaryColor}</p>
              </div>
              <div className="flex-1">
                <div
                  className="h-12 rounded-md mb-2"
                  style={{ backgroundColor: palette.foreignColor }}
                />
                <p className="text-sm text-gray-600">Foreign: {palette.foreignColor}</p>
              </div>
            </div>

            <div className="text-xs text-gray-500">Key: {palette.key}</div>
          </div>
        ))}
      </div>

      {allPalettes.length === 0 && (
        <div className="text-center py-12 text-gray-500">No palettes found</div>
      )}

      {hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

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
        <PalettesContent />
      </Suspense>
    </ErrorBoundary>
  );
};
