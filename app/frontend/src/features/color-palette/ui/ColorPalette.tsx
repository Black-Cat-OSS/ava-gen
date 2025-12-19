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
  /**
   * Currently selected color scheme
   * @optional
   * @description The palette that is currently selected. If provided, the component will highlight it in the UI.
   */
  selectedScheme?: Pallete;

  /**
   * Callback function triggered when user selects a different palette
   * @optional
   * @param palette - The newly selected color palette
   * @description Called when the user clicks on a palette option. Use this to update the parent component's state.
   */
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
      <strong className="block text-sm text-foreground">
        {t('features.avatarGenerator.colorScheme')}
      </strong>

      <ErrorBoundary>
        <Suspense fallback={<ColorPaletteSkeleton />}>
          <PaletteSelector selectedScheme={selectedScheme} onPaletteChange={onPaletteChange} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
