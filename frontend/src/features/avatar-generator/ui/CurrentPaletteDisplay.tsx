import { useTranslation } from 'react-i18next';
import { useColorPaletteContext } from '@/features/color-palette';

/**
 * Component for displaying the currently selected color palette.
 * Uses ColorPaletteContext to avoid prop drilling.
 */
export const CurrentPaletteDisplay = () => {
  const { t } = useTranslation();
  const { selectedScheme, palettes } = useColorPaletteContext();

  const currentPalette = palettes?.find(p => p.key === selectedScheme);

  return (
    <div className="p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">
          {t('features.avatarGenerator.currentPalette')}
        </h3>
        <span className="text-xs text-muted-foreground capitalize">
          {currentPalette?.name || selectedScheme}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-border shadow-sm flex-shrink-0"
            style={{ backgroundColor: currentPalette?.primaryColor || '#3b82f6' }}
          />
          <div className="text-sm min-w-0">
            <p className="font-medium text-foreground">
              {t('features.avatarGenerator.primaryColor')}
            </p>
            <p className="text-muted-foreground font-mono text-xs truncate">
              {currentPalette?.primaryColor || '#3b82f6'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-border shadow-sm flex-shrink-0"
            style={{ backgroundColor: currentPalette?.foreignColor || '#ef4444' }}
          />
          <div className="text-sm min-w-0">
            <p className="font-medium text-foreground">
              {t('features.avatarGenerator.foreignColor')}
            </p>
            <p className="text-muted-foreground font-mono text-xs truncate">
              {currentPalette?.foreignColor || '#ef4444'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};