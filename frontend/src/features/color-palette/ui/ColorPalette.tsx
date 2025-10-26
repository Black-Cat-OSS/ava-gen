import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { useColorPaletteContext } from '../hooks/useColorPaletteContext';

/**
 * Component for selecting color palettes from predefined schemes
 * Displays available color palettes in a grid layout with visual preview
 * Uses ColorPaletteContext for state management
 */
export const ColorPalette = () => {
  const { t } = useTranslation();
  const {
    selectedScheme,
    colorSchemes,
    palettes,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    onPaletteChange,
    onRandomPalette,
    loadMore,
  } = useColorPaletteContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.colorScheme')}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRandomPalette}
          className="text-xs"
          disabled={isLoading}
        >
          {t('features.avatarGenerator.randomPalette')}
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">{t('features.avatarGenerator.loadingColorPalettes')}</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">{t('features.avatarGenerator.failedToLoadColorPalettes')}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {colorSchemes.map(scheme => {
          const palette = palettes?.find(p => p.key === scheme.value);
          const isSelected = selectedScheme === scheme.value;
          
          if (!palette) return null; // Не отображаем палитры, которых нет в API
          
          return (
            <button
              key={scheme.value}
              type="button"
              onClick={() => onPaletteChange(scheme.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'shadow-lg ring-2 ring-offset-2 ring-primary/20'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
              style={{
                borderColor: isSelected ? palette.primaryColor : undefined,
                backgroundColor: isSelected ? `${palette.primaryColor}15` : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: palette.primaryColor }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: palette.foreignColor }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">{scheme.label}</p>
            </button>
          );
        })}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? t('features.avatarGenerator.loadingMore') : t('features.avatarGenerator.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
};
