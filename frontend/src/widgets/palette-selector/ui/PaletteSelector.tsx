import { useTranslation } from 'react-i18next';
import { usePalletesSuspense } from '@/shared/lib/hooks';
import { useEffect, useState } from 'react';
import type { Pallete } from '@/entities';
import { Button } from '@/shared/ui';
import { PaletteCard } from '@/widgets/palette-card';

const CHUNK_SIZE = 30;

/**
 * Props for the PaletteSelector component
 */
export interface PaletteSelectorProps {
  /** Currently selected color scheme */
  selectedScheme?: Pallete;
  /** Callback when palette is changed */
  onPaletteChange?: (palette: Pallete) => void;
}

/**
 * Component for selecting color palettes with pagination
 * Displays available color palettes in a grid layout with load more functionality
 *
 * @param props - Component props
 */
export const PaletteSelector = ({ selectedScheme, onPaletteChange }: PaletteSelectorProps) => {
  const [chunk, setChunk] = useState<number>(1);

  const { data, refetch } = usePalletesSuspense({ offset: 0, pick: chunk * CHUNK_SIZE });

  const { t } = useTranslation();

  const [selectedPalette, setSelectedPalette] = useState<Pallete | null>(selectedScheme || null);

  useEffect(() => {
    refetch();
  }, [chunk, refetch]);

  return (
    <div className="flex justify-center flex-col items-center w-full">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full">
        {data?.items?.map(palette => (
          <PaletteCard
            key={palette.id}
            palette={palette}
            type="mini"
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
