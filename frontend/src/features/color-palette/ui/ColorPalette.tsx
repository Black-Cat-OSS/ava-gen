import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import { usePalletes } from '../hooks/usePalletes';
import { Suspense, useEffect, useState } from 'react';
import { ColorPaletteSkeleton } from './ColorPaletteSkeleton';
import type { Pallete } from '@/entities';
import { Button } from '@/shared/ui';
import { PaletteButton } from './PaletteButton';
import { CHUNK_SIZE } from '../constants';

/**
 * Props for the ColorPalette component
 */
export interface ColorPaletteProps {
  /** Currently selected color scheme */
  selectedScheme?: Pallete;
  /** Callback when palette is changed */
  onPaletteChange?: (palette: Pallete) => void;
}

/**
 * Component for selecting color palettes from predefined schemes
 * Displays available color palettes in a grid layout with visual preview
 *
 * @param props - Component props
 */
export const ColorPalette = ({ selectedScheme, onPaletteChange }: ColorPaletteProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground">
          {t('features.avatarGenerator.colorScheme')}
        </label>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<ColorPaletteSkeleton />}>
          <ColorGrid selectedScheme={selectedScheme} onPaletteChange={onPaletteChange} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const ColorGrid = ({ selectedScheme, onPaletteChange }: ColorPaletteProps) => {
  const [chunk, setChunk] = useState<number>(1);

  const { data, refetch } = usePalletes({ offset: 0, pick: chunk * CHUNK_SIZE });

  const { t } = useTranslation();

  const [selectedPalette, setSelectedPalette] = useState<Pallete | null>(selectedScheme || null);

  useEffect(() => {
    refetch();
  }, [chunk, refetch]);

  return (
    <div className="flex justify-center flex-col items-center w-full">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full">
        {data?.items?.map(palette => (
          <PaletteButton
            key={palette.id}
            palette={palette}
            isSelected={selectedPalette?.id === palette.id}
            onClick={palette => {
              setSelectedPalette(palette);
              onPaletteChange?.(palette);
            }}
          />
        ))}
      </div>
      <Button
        className="mt-6"
        type="button"
        onClick={() => setChunk(prev => prev + 1)}
        disabled={!data?.pagination.hasMore}
      >
        {t('features.avatarGenerator.loadMore')}
      </Button>
    </div>
  );
};
