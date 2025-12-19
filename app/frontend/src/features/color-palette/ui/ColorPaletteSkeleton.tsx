import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';

/**
 * Skeleton component for color palette loading state
 * Shows animated placeholders while color palettes are being fetched
 * Provides visual feedback during Suspense loading
 */
export const ColorPaletteSkeleton = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          disabled
        >
          {t('features.avatarGenerator.randomPalette')}
        </Button>
      </div>
      
      <div className="text-center py-4">
        <div className="h-4 w-32 bg-muted animate-pulse rounded mx-auto" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border-2 border-border bg-muted animate-pulse"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
              <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="h-3 bg-muted-foreground/20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
