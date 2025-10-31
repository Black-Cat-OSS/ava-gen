import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import { Suspense } from 'react';
import { ColorPaletteSkeleton } from './ColorPaletteSkeleton';
import type { Pallete } from '@/entities';
import { PaletteSelector } from '@/widgets';

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
          <PaletteSelector selectedScheme={selectedScheme} onPaletteChange={onPaletteChange} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
